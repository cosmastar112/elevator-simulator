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
            let type = call.getType();

            switch(type) {
                case root.getCallBuilder().CALLTYPE_CABIN:
                    _pushCallFromCabin(call, self);
                    break;
                case root.getCallBuilder().CALLTYPE_FLOOR:
                    _pushCallFromFloor(call, self);
                    break;
                default:
                    break;
            }
        }

        return cb;
    }

    function _pushCallFromFloor(call, self)
    {
        self._queue.push(call);
        //событие поступления вызова в очередь
        let callFromFloorRegisteredEvent = _createCallFromFloorRegisteredEvent(call);
        document.dispatchEvent(callFromFloorRegisteredEvent);
    }

    function _pushCallFromCabin(call, self)
    {
        self._queue.push(call);
        //событие поступления вызова в очередь
        // let callFromCabinRegisteredEvent = _createCallFromCabinRegisteredEvent(call);
        // document.dispatchEvent(callFromCabinRegisteredEvent);
    }

    function _createCallFromFloorRegisteredEvent(call)
    {
        return new CustomEvent('callFromFloorRegistered', {
            detail: {
                call: call
            }
        });
    }

    // function _createCallFromCabinRegisteredEvent(call)
    // {
    //     return new CustomEvent('callFromCabinRegistered', {
    //         detail: {
    //             call: call
    //         }
    //     });
    // }

    root.registerModule({
        id: 'callQueueBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);