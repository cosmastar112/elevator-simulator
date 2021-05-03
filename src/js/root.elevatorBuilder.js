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
        // создать представление
        elevator._view = _createView(params.number);

        elevator._setState(STATE_IDLE);

        return elevator;
    }

    function _createView(number)
    {
        let view = document.createElement('div');
        view.innerHTML = number;

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
            let nextCall = self.getRoute().getNext();
            // console.log('Следующая цель маршрута: ' + nextCall);
            if (nextCall) {
                //пометить вызов как «Находящийся в обработке»
                nextCall.processing = true;
                _setState.call(self, STATE_MOVE);
            } else {
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
            let ETA = _getETA(call);
            console.log('ETA: '+ ETA);
            //движение в течении рассчитаного времени
            let moveTimer = setTimeout(function() {
                //убрать вызов из маршрута
                self.getRoute().remove(call);
                console.log('Движение выполнено');
                _setState.call(self, STATE_STOP);
            }, ETA);
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
            getNext: function() {
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

    function _getETA(call)
    {
        // let ETA_ONE_FLOOR = 5; //время, необходимое на движение на один этаж
        let ETA_ONE_FLOOR = 1; //время, необходимое на движение на один этаж
        let N = Math.abs(1 - call.floor);
        let ETA = ETA_ONE_FLOOR * N;

        return ETA * 1000;
    }

    root.registerModule({
        id: 'elevatorBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);