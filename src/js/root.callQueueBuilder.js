;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _queue: [],
            _elevatorCallCreatedHandler: null,
            getQueue: function() {
                return this._queue;
            },
            getNextCall: function() {
                //FIFO stack
                return this._queue.shift();
            },
            hasCalls: function() {
                return this._queue.length > 0;
            }
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        newObj._elevatorCallCreatedHandler = _createElevatorCallCreatedHandler(newObj);

        //подписаться на создание вызова лифта с этажа
        document.addEventListener('elevatorCallFromFloorCreated', newObj._elevatorCallCreatedHandler);
        //подписаться на создание вызова лифта из кабины
        document.addEventListener('elevatorCallFromCabinCreated', newObj._elevatorCallCreatedHandler);

        return newObj;
    }

    function _createElevatorCallCreatedHandler(self)
    {
        let cb = function(event) {
            let call = event.detail.call;
            self._queue.push(call);
            //запомнить время регистрации вызова
            call.setRegisteredAt();

            let callRegisteredEvent = _createCallRegisteredEvent(call);
            if (callRegisteredEvent) {
                document.dispatchEvent(callRegisteredEvent);
            }
        }

        return cb;
    }

    function _createCallRegisteredEvent(call)
    {
        let newEvent = null;
        let callType = call.getType();

        switch(callType) {
            case root.getCallBuilder().CALLTYPE_CABIN:
                newEvent = _createCallFromCabinRegisteredEvent(call);
                break;
            case root.getCallBuilder().CALLTYPE_FLOOR:
                newEvent = _createCallFromFloorRegisteredEvent(call);
                break;
            default:
                break;
        }

        return newEvent;
    }

    function _createCallFromFloorRegisteredEvent(call)
    {
        return new CustomEvent('callFromFloorRegistered', {
            detail: {
                call: call
            }
        });
    }

    function _createCallFromCabinRegisteredEvent(call)
    {
        return new CustomEvent('callFromCabinRegistered', {
            detail: {
                call: call
            }
        });
    }

    root.registerModule({
        id: 'callQueueBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);