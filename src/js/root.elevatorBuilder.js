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
        elevator._controlPanel = _createControlPanel(params);
        //инициализация маршрута
        elevator._route = _createRoute();
        //начальная позиция
        elevator._currentPosition = 1;
        // создать представление
        elevator._view = _createView(params.number);

        elevator._setState(STATE_IDLE);

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
        let controlPanel = controlPanelBuilder.construct(params);

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

            let nextCall = null;
            //если движение было прервано
            if (activeCall) {
                //искать следующий вызов по принципу: ближайший по ходу движения
                let elevatorCurrentPosition = self.getCurrentPosition();
                let direction = activeCall.floor - elevatorCurrentPosition;
                nextCall = self.getRoute().getNearestByDirection(direction, elevatorCurrentPosition);
            } else {
                //искать следующий вызов по принципу: последний добавленый
                nextCall = self.getRoute().getNearest();
            }

            if (nextCall) {
                console.log('Следующая цель маршрута: ' + nextCall.floor, nextCall.direction);
                //пометить вызов как «Находящийся в обработке»
                nextCall.processing = true;
                _setState.call(self, STATE_MOVE);
            } else {
                console.log('Все цели маршрута обработаны');
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

            //время, необходимое для движения на один этаж
            let oneMoveTime = 500;
            //количество необходимых движений для выполнения перемещения
            let moves = Math.abs(self._currentPosition - call.floor);
            console.log('Нужно сделать ' + moves + ' движений');
            //выполненных движений
            let finishedMoves = 0;
            let moveOneFloorTimer = setInterval(function() {
                if (moves === finishedMoves) {
                    console.log('Перемещение завершено: ' + call.floor, call.direction);
                    clearInterval(moveOneFloorTimer);
                    //убрать вызов из маршрута
                    self.getRoute().remove(call);
                    _setState.call(self, STATE_STOP);
                } else {
                    //движение (на один этаж) выполнено
                    finishedMoves++;
                    //запомнить предыдущую позицию
                    let oldPosition = self._currentPosition;
                    //изменить текущую позицию
                    if (call.floor > self._currentPosition) {
                        self._currentPosition++;
                    } else {
                        self._currentPosition--;
                    }
                    console.log('Сделано движение ' + finishedMoves);
                    //уведомить об изменении позиции лифта
                    _notifyAboutUpdatElevatorPosition(oldPosition, self._currentPosition, self);
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
            _setState.call(self, STATE_UNLOADING);
            // _setState.call(self, STATE_LOADING);
        } else if(state === STATE_UNLOADING) {
            console.log('STATE_UNLOADING');
            _setState.call(self, STATE_WAITING_FOR_INPUT);
        } else if(state === STATE_LOADING) {
            console.log('STATE_LOADING');
            _setState.call(self, STATE_WAITING_FOR_INPUT);
        } else if(state === STATE_WAITING_FOR_INPUT) {
            console.log('STATE_WAITING_FOR_INPUT');
            _setState.call(self, STATE_DOORS_CLOSING);
        } else if(state === STATE_DOORS_CLOSING) {
            console.log('STATE_DOORS_CLOSING');
            _setState.call(self, STATE_CHOOSE_NEXT_TARGET);
        }

        //обновить состояние
        self._state = state;
    }

    function _createRoute()
    {
        let newObj = {
            _route: [],
            getRoute: function() {
                return this._route;
            },
            isEmpty: function() {
                let isEmpty = !this._route || !Array.isArray(this._route) || this._route.length < 1;
                return isEmpty;
            },
            add: function(call) {
                this._route.push(call);
            },
            getNearestByDirection: function(direction, elevatorCurrentPosition) {
                if (direction > 0) {
                    //движение наверх
                    let calls = this._route.filter(function(item) {
                        return item.floor > elevatorCurrentPosition;
                    });
                    calls.sort(function(a, b) {
                        return parseInt(a.floor) > parseInt(b.floor) ? 1: -1;
                    });
                    return calls.shift();
                } else if (direction < 0) {
                    //движение вниз
                    let calls = this._route.filter(function(item) {
                        return item.floor < elevatorCurrentPosition;
                    });
                    calls.sort(function(a, b) {
                        return parseInt(a.floor) > parseInt(b.floor) ? 1: -1;
                    });
                    return calls.pop();
                }
            },
            getNearest: function() {
                //ближайший в любом направлении
                let lastIndex = this._route.length - 1;
                return this._route[lastIndex];
            },
            getActiveCall: function() {
                let item = this._route.find(function(item) {
                    return item.processing && item.processing === true;
                });
                return item;
            },
            remove: function(call) {
                let itemIndex = this._route.findIndex(function(item) {
                    return item.processing && item.processing === true;
                });
                this._route.splice(itemIndex, 1);
            }

        };

        return newObj;
    }

    function _notifyAboutUpdatElevatorPosition(oldPosition, newPosition, elevator)
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
            activeCallFloor = activeCall.floor;
        }
        //интервалы типа (1;2), (7;8), (6;5) и т.д.
        if (Math.abs(currentPosition - activeCallFloor) < 1) {
            return true;
        }
        let route = this.getRoute().getRoute();
        let newActiveCall = route.filter(function(item) {
            //движение наверх
            let isC1 = !item.processing && item.floor > currentPosition && item.floor < activeCallFloor;
            //движение вниз
            let isC2 = !item.processing && item.floor < currentPosition && item.floor > activeCallFloor;
            return isC1 || isC2;
        });

        //в интервале появился новый активный вызов
        if (newActiveCall.length > 0) {
            return false;
        }

        return true;
    }

    root.registerModule({
        id: 'elevatorBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);