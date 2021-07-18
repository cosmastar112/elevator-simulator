;(function(root) {

    let _elevator;

    const STATE_IDLE = 1;
    const STATE_CHOOSE_NEXT_TARGET = 2;
    const STATE_MOVE = 3;
    const STATE_STOP = 4;
    const STATE_DOORS_OPENING = 5;
    const STATE_UNLOADING = 6;
    const STATE_LOADING = 7;
    const STATE_WAITING_FOR_INPUT = 8;
    const STATE_DOORS_CLOSING = 9;

    let MIN_FLOOR;
    let MAX_FLOOR;

    function init()
    {
        _elevator = {
            _number: null,
            _lifting_power: null,
            _view: null,
            _controlPanel: null,
            _state: null,
            _route: null,
            _currentPosition: null,
            _lastDirection: null,
            _passengersInCabin: null,
            getNumber: function() {
                return this._number;
            },
            getLiftingPower: function() {
                return this._lifting_power;
            },
            getControlPanel: function() {
                return this._controlPanel;
            },
            getView: function() {
                return this._view;
            },
            getState: function() {
                return this._state;
            },
            getRoute: function() {
                return this._route;
            },
            isRouteEmpty: function() {
                let isEmpty = this._route.isEmpty();
                return isEmpty;
            },
            getCurrentPosition: function() {
                return this._currentPosition;
            },
            memorizeLastDirection: function(call) {
                let elevatorCurrentPosition = this.getCurrentPosition();
                let directionInt = call.getFloor() - elevatorCurrentPosition;
                let direction = directionInt > 0 ? 1 : -1;
                console.log('Фиксация последнего направления движения: '+ direction);
                this._lastDirection = direction;
            },
            clearLastDirection: function() {
                console.log('Сброс последнего направления движения');
                this._lastDirection = null;
            },
            getLastDirection: function() {
                return this._lastDirection;
            },
            getPassengersInCabin: function() {
                return this._passengersInCabin;
            },
            attachPassenger: function(passenger) {
                this._passengersInCabin.push(passenger);
                //синхронизация модели панели
                _syncControlPanelModel(this, this._passengersInCabin);
            },
            detachPassenger: function(passengerId) {
                let pIndex = this._passengersInCabin.findIndex(function(passenger) {
                    return passenger.getId() === passengerId;
                });
                //удалить элемент
                if (pIndex !== -1) {
                    this._passengersInCabin.splice(pIndex, 1);
                }
                //синхронизация модели панели
                _syncControlPanelModel(this, this._passengersInCabin);
            },
            //проверить: есть ли в кабине лифта пассажир с указанным id
            isPassengerInCabin: function(passengerId) {
                let person = this._passengersInCabin.find(function(item) {
                    return item.getId() === passengerId;
                });

                return person ? true : false;
            },
            getTotalWeight: function() {
                return this.getPassengersInCabin().reduce(function(accumulator, passenger) {
                    let currentValue = passenger.getWeight();
                    return accumulator + currentValue;
                }, 0);
            },
            _setState: _setState,
        };
    }

    function construct(params)
    {
        let elevator = Object.assign({}, _elevator);
        elevator._number = params.number;
        // грузоподёмность
        elevator._lifting_power = params.lifting_power;
        // панель управления
        elevator._controlPanel = _createControlPanel({number: params.number, total_floors: params.total_floors});
        //инициализация маршрута
        elevator._route = _createRoute();
        //начальная позиция
        elevator._currentPosition = 1;
        //инициализация хранилища "пассажиры в кабине"
        elevator._passengersInCabin = [];
        // создать представление
        elevator._view = _createView(params.number);

        MIN_FLOOR = 1;
        MAX_FLOOR = params.total_floors;

        return elevator;
    }

    function _createView(number)
    {
        let view = document.createElement('div');
        view.innerHTML = 'Лифт №'+number;

        return view;
    }

    function _createControlPanel(params)
    {
        let controlPanelBuilder = root.getControlPanelBuilder();
        let controlPanel = controlPanelBuilder.construct({number: params.number, total_floors: params.total_floors});

        return controlPanel;
    }

    function _setState(state)
    {
        //указатель на контекст объекта (лифт)
        let self = this;
        if (state === STATE_IDLE) {
            console.log('STATE_IDLE');
            /*Во время нахождения лифта в состоянии «Бездействие» работает циклический таймер, 
            который проверяет пустоту маршрута. Если маршрут не пуст, то происходит переход в 
            состояние «Выбор следующего вызова для обработки»*/
            let checkRouteEmptynessTimerId = setInterval(function() {
                // console.log('isRouteEmpty:', self.isRouteEmpty());
                if (!self.isRouteEmpty()) {
                    console.log('маршрут лифта больше не пуст, выполняется выход из состояния бездействия');
                    clearInterval(checkRouteEmptynessTimerId);
                    _setState.call(self, STATE_CHOOSE_NEXT_TARGET);
                }
            }, 1000);
            //сброс последнего направления движения
            self.clearLastDirection();
        } else if(state === STATE_CHOOSE_NEXT_TARGET) {
            /*В состоянии «Выбор следующей цели маршрута» выполняется выбор следующего 
            вызова для обработки. Если следующего вызова нет, то выполняется возврат в состояние 
            «Бездействие». Если следующий вызов есть, то он помечается как «Находящийся в 
            обработке» и происходит переход в состояние «Движение».*/
            console.log('STATE_CHOOSE_NEXT_TARGET');

            //если движение было прервано
            let activeCall = self.getRoute().getActiveCall();
            // console.log(activeCall);
            if (activeCall) {
                //снять с текущего активного вызова отметку «Находящийся в обработке»
                activeCall.processing = false;
            }

            //если предыдущее состояние - НЕ бездействие
            let nextCall = null;
            let direction = self.getLastDirection();
            if (direction !== null) {
                //искать следующий вызов по принципу: ближайший по ходу движения
                let elevatorCurrentPosition = self.getCurrentPosition();
                nextCall = self.getRoute().getNearestByDirection(direction, elevatorCurrentPosition);
                //если вызовы по ходу движения закончились, посмотреть наличие вызовов в обратном направлении
                if (!nextCall) {
                    let revertedDirection = direction === 1 ? -1: 1;
                    nextCall = self.getRoute().getNearestByDirection(revertedDirection, elevatorCurrentPosition);
                }
            } else {
                //последний добавленный
                nextCall = self.getRoute().getNearest();
            }

            if (nextCall) {
                console.log('Следующая цель маршрута: ' + nextCall.getFloor(), nextCall.getDirection());
                //пометить вызов как «Находящийся в обработке»
                nextCall.processing = true;
                _setState.call(self, STATE_MOVE);
            } else {
                console.log('Все цели маршрута обработаны', self);
                _setState.call(self, STATE_IDLE);
            }
        } else if(state === STATE_MOVE) {
            /*В состоянии «Движение» лифт перемещается к цели следования.
            Для этого рассчитывается время, необходимое для перемещения (ETA). 
            */
            //обрабатываемый вызов
            let call = self.getRoute().getActiveCall();
            //аварийная ситуация: текущего вызова нет
            if (!call) {
                return;
            }

            //уведомить подписчиков о том, что началась обработка вызова
            _notifyAboutCallProcessingStarted(call);
            //запомнить последнее направление движения
            self.memorizeLastDirection(call);

            //время, необходимое для движения на один этаж
            let oneMoveTime = 500;
            //количество необходимых движений для выполнения перемещения
            let moves = Math.abs(self._currentPosition - call.getFloor());
            console.log('Нужно сделать ' + moves + ' движений');
            //выполненных движений
            let finishedMoves = 0;
            let moveOneFloorTimer = setInterval(function() {
                if (moves === finishedMoves) {
                    console.log('Перемещение завершено: ' + call.getFloor(), call.getDirection());
                    clearInterval(moveOneFloorTimer);
                    //убрать вызов из маршрута
                    self.getRoute().remove(call);
                    //уведомить подписчиков о том, что обработка вызова закончилась
                    _notifyAboutCallProcessingFinished(call);
                    _setState.call(self, STATE_STOP);
                } else {
                    //движение (на один этаж) выполнено
                    finishedMoves++;
                    //запомнить предыдущую позицию
                    let oldPosition = self._currentPosition;
                    //изменить текущую позицию
                    if (call.getFloor() > self._currentPosition) {
                        self._currentPosition++;
                    } else {
                        self._currentPosition--;
                    }
                    console.log('Сделано движение ' + finishedMoves);
                    //уведомить об изменении позиции лифта
                    _notifyAboutUpdateElevatorPosition(oldPosition, self._currentPosition, self);
                    //проверка необходимости прерывания текущего движения и смены активного вызова
                    if (!_isCurrentActiveCallRelevant.call(self)) {
                        console.log('Прерывание текущего движения: смена активного вызова');
                        clearInterval(moveOneFloorTimer);
                        _setState.call(self, STATE_CHOOSE_NEXT_TARGET);
                    }
                }
            }, oneMoveTime);
        } else if(state === STATE_STOP) {
            console.log('STATE_STOP');
            _setState.call(self, STATE_DOORS_OPENING);
        } else if(state === STATE_DOORS_OPENING) {
            console.log('STATE_DOORS_OPENING');
            //решить нужна ли выгрузка пассажиров
            if (root.getBuilder().getBuilding().getLoadingAndUnloadingManager().hasPassengersWhoWillUnload(self)) {
                //нужна
                _setState.call(self, STATE_UNLOADING);
            } else {
                //не нужна
                _setState.call(self, STATE_LOADING);
            }
        } else if(state === STATE_UNLOADING) {
            console.log('STATE_UNLOADING');

            //выгрузка пассажиров
            let unloadingPromise = new Promise(function(resolve, reject) {
                root.getBuilder().getBuilding().getLoadingAndUnloadingManager().unload(self);
                resolve('result');
            });
            unloadingPromise.then(function(result) {
                //погрузка
                _setState.call(self, STATE_LOADING);
            });
        } else if(state === STATE_LOADING) {
            console.log('STATE_LOADING');

            let floor = self.getCurrentPosition();
            let loadingPromise = new Promise(function(resolve, reject) {
                // console.log('Погрузка начата');
                let loadedPersons = root.getBuilder().getBuilding().getLoadingAndUnloadingManager().load(floor, self);
                resolve(loadedPersons);
            });
            loadingPromise.then(function(loadedPersons) {
                // console.log('Погрузка завершена');
                //уведомить об окончании погрузки
                let elevatorLoadingCompletedEvent = _createElevatorLoadingCompletedEvent(loadedPersons, self, floor);
                document.dispatchEvent(elevatorLoadingCompletedEvent);
                _setState.call(self, STATE_WAITING_FOR_INPUT);
            });
        } else if(state === STATE_WAITING_FOR_INPUT) {
            console.log('STATE_WAITING_FOR_INPUT');
            //выбор пассажирами этажей назначения
            let choosedFloors = _chooseFloors(self);
            console.log('Этажи назначения', choosedFloors);
            //TODO: создать вызовы на основе выбранных этажей
            self.getControlPanel().getPanelButtons().handlePassengersInput(choosedFloors);

            //TODO: ожидать окончания создания вызовов;
            //временное решение: дать полсекунды на регистрацию вызовов,
            setTimeout(function() {
                //а затем переключить состояние
                _setState.call(self, STATE_DOORS_CLOSING);
            }, 500 /*полсекунды на регистрацию вызовов*/);
        } else if(state === STATE_DOORS_CLOSING) {
            console.log('STATE_DOORS_CLOSING');
            //уведомить о закрытии дверей
            let floor = self.getCurrentPosition();
            _notifyAboutDoorsClosed(self, floor);
            _setState.call(self, STATE_CHOOSE_NEXT_TARGET);
        }

        //обновить состояние
        self._state = state;
    }

    function _createRoute()
    {
        let routeBuilder = root.getRouteBuilder();
        let route = routeBuilder.construct();

        return route;
    }

    function _notifyAboutUpdateElevatorPosition(oldPosition, newPosition, elevator)
    {
        let eventDetail = {
            oldPosition: oldPosition,
            newPosition: newPosition,
            elevator: elevator
        };
        let eventElevatorPositionUpdated = _createElevatorPositionUpdatedEvent(eventDetail);
        document.dispatchEvent(eventElevatorPositionUpdated);
    }

    function _createElevatorPositionUpdatedEvent(detail)
    {
        return new CustomEvent('elevatorPositionUpdated', {
            detail: detail
        });
    }

    function _isCurrentActiveCallRelevant()
    {
        //текущая позиция (этаж) лифта
        let currentPosition = this._currentPosition;
        //этаж назначения активного вызова
        let activeCallFloor = null;
        let activeCall = this.getRoute().getActiveCall();
        //аварийная ситуация: активный вызов не найден
        if (!activeCall) {
            return true;
        } else {
            activeCallFloor = activeCall.getFloor();
        }
        //интервалы типа (1;2), (7;8), (6;5) и т.д.
        if (Math.abs(currentPosition - activeCallFloor) < 1) {
            return true;
        }
        let route = this.getRoute().getRoute();
        let newActiveCall = route.filter(function(item) {
            //движение наверх
            let isC1 = !item.processing && item.getFloor() > currentPosition && item.getFloor() < activeCallFloor;
            //движение вниз
            let isC2 = !item.processing && item.getFloor() < currentPosition && item.getFloor() > activeCallFloor;
            return isC1 || isC2;
        });

        //в интервале появился новый активный вызов
        if (newActiveCall.length > 0) {
            return false;
        }

        return true;
    }

    function _notifyAboutDoorsClosed(elevator, floor)
    {
        let eventDetail = {
            elevator: elevator,
            floor: floor,
        };
        let event = _createElevatorDoorsClosedEvent(eventDetail);
        document.dispatchEvent(event);
    }

    function _createElevatorDoorsClosedEvent(detail)
    {
        return new CustomEvent('elevatorDoorsClosed', {
            detail: detail
        });
    }

    function _syncControlPanelModel(elevator, passengers)
    {
        //панель "Количество пассажиров"
        let length = passengers.length;
        elevator.getControlPanel().getPanelPersonsTotalNum().setTotal(length);
        _notifyAboutPanelPersonsTotalNumModelUpdated(elevator);

        //панель "Общий вес пассажиров"
        let weight = elevator.getTotalWeight();
        elevator.getControlPanel().getPanelPersonsTotalWeight().setTotal(weight);
        _notifyAboutPanelPersonsTotalWeightModelUpdated(elevator);
    }

    function _notifyAboutPanelPersonsTotalNumModelUpdated(elevator)
    {
        let event = _createPanelPersonsTotalNumModelUpdatedEvent({elevator: elevator});
        document.dispatchEvent(event);
    }

    function _createPanelPersonsTotalNumModelUpdatedEvent(detail)
    {
        return new CustomEvent('panelPersonsTotalNumModelUpdated', {
            detail: detail
        });
    }

    function _notifyAboutPanelPersonsTotalWeightModelUpdated(elevator)
    {
        let event = _createPanelPersonsTotalWeightModelUpdatedEvent({elevator: elevator});
        document.dispatchEvent(event);
    }

    function _createPanelPersonsTotalWeightModelUpdatedEvent(detail)
    {
        return new CustomEvent('panelPersonsTotalWeightModelUpdated', {
            detail: detail
        });
    }

    //выбор пассажирами этажей назначения
    //@param Object elevator лифт
    //@return Array выбранные этажи
    function _chooseFloors(elevator)
    {
        //определить только что погруженных пассажиров (по косвенному признаку - без этажа назначения)
        let passengersWithoutUnloadingFloor = elevator._passengersInCabin.filter(function(passenger) {
            return passenger.getUnloadingFloor() === null;
        });
        // console.log('Погруженные пассажиры', passengersWithoutUnloadingFloor);

        let choosedFloors = passengersWithoutUnloadingFloor.map(function(passenger) {
            let choosedFloor = passenger.chooseUnloadingFloor({
                minFloor: 1,
                maxFloor: root.getBuilder().getBuilding().getTotalFloors(),
                currentFloor: elevator.getCurrentPosition(),
                moveDirection: elevator.getLastDirection(),
            });

            return passenger.getUnloadingFloor();
        });

        return choosedFloors;
    }

    function _notifyAboutCallProcessingStarted(call)
    {
        //запомнить время начала обработки вызова
        call.setStartedAt();
        let event = new CustomEvent('callProcessingStarted', {
            detail: {
                call: call
            }
        });
        document.dispatchEvent(event);
    }

    function _notifyAboutCallProcessingFinished(call)
    {
        //запомнить время окончания обработки вызова
        call.setFinishedAt();
        let event = new CustomEvent('callProcessingFinished', {
            detail: {
                call: call
            }
        });
        document.dispatchEvent(event);
    }

    function _createElevatorLoadingCompletedEvent(loadedPersons, elevator, floorNumber)
    {
        return new CustomEvent('elevatorLoadingCompleted', {
            detail: {
                loadedPersons: loadedPersons,
                elevator: elevator,
                floorNumber: floorNumber,
            }
        });
    }

    root.registerModule({
        id: 'elevatorBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);