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
            },
            isCallExists: function(targetFloor) {
                let findedItem = false;

                //1.искать вызов в очереди вызовов
                let queueItems = this.getCallQueue().getQueue();
                findedItem = queueItems.find(function(queueItem) {
                    return queueItem.getFloor() === targetFloor;
                })

                //2.если вызов найден в очереди, закончить проверку
                if (findedItem) return true;

                //иначе проверить маршруты всех лифтов
                for (let elevatorIndex = 0, l = this._elevators.length; elevatorIndex < l; elevatorIndex++) {
                    let currentElevator = this._elevators[elevatorIndex];
                    if (currentElevator.getRoute().isCallExists(targetFloor)) {
                        //вызов найден в маршруте лифта
                        findedItem = true;
                        //прекратить поиск
                        break;
                    }
                }

                return findedItem;
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
        //запомнить время назначения исполнителя вызова
        call.setAllocatedAt();

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