;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _elevators: null,
            _callQueue: null,
            _callQueueHandler: null,
            _callQueueHandlerIntervalID: null,
            getCallQueue: function() {
                return this._callQueue;
            },
            destruct: function() {
                clearInterval(this._callQueueHandlerIntervalID);
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        //лифты
        newObj._elevators = params.elevators;
        //очередь вызова
        newObj._callQueue = _createCallQueue();

        //запуск цикла работы обработчика очереди
        newObj._callQueueHandlerIntervalID = setInterval(function() {
            _callQueueHandler(newObj);
        }, 100);

        return newObj;
    }

    function _createCallQueue()
    {
        let callQueueBuilder = root.getCallQueueBuilder();
        let callQueue = callQueueBuilder.construct();

        return callQueue;
    }

    function _callQueueHandler(self)
    {
        //console.log(Date.now(), '_callQueueHandler');
        let callQueue = self.getCallQueue();
        if (callQueue.hasCalls() > 0) {
            let call = callQueue.getNextCall();
            console.log('обработка вызова из очереди', call);
            _allocateCall(self, call);
        }/* else {
            console.log('очереди вызова пуста');
        }*/
    }

    //назначить вызов исполнителю (лифту)
    function _allocateCall(self, call)
    {
        //поскольку лифт всегда один, исполнитель предопределен
        let elevator = self._elevators[0];
        //маршрут лифта
        let route = elevator.getRoute();
        route.add(call);

        //уведомить о том, что вызов назначен исполнителю
        _notifyAboutCallAllocated(call, elevator.getNumber());
    }

    function _notifyAboutCallAllocated(call, elevatorNumber)
    {
        let eventDetail = {
            call: call,
            elevatorNumber: elevatorNumber,
        };
        let eventCallAllocated = new CustomEvent('elevatorCallAllocated', {
            detail: eventDetail
        });
        document.dispatchEvent(eventCallAllocated);
    }

    root.registerModule({
        id: 'routerBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);