;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _queue: [],
            _queueHandler: null,
            _queueHandlerIntervalID: null,
            _elevatorCallFromFloorCreatedHandler: null,
            getQueue: function() {
                return this._queue;
            },
            destruct: function() {
                clearInterval(this._queueHandlerIntervalID);
            }
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        //подписаться на создание вызова лифта
        newObj._elevatorCallFromFloorCreatedHandler = _createElevatorCallFromCallCreatedHandler(newObj);
        document.addEventListener('elevatorCallFromFloorCreated', newObj._elevatorCallFromFloorCreatedHandler);

        //запуск цикла работы обработчика очереди
        newObj._queueHandlerIntervalID = setInterval(function() {
            _queueHandler(newObj);
        }, 1000);

        return newObj;
    }

    function _createElevatorCallFromCallCreatedHandler(self)
    {
        let cb = function(event) {
            _push(event.detail.call, self);

            // let floor = event.detail.call.floor;
            // let direction = event.detail.call.direction;
            // let text = 'В очередь попал вызов: ';
            // text += 'этаж ' + floor + '; ';
            // text += 'направление ' + direction;
            // alert(text);
            // console.log('поступил вызов лифта');
        }

        return cb;
    }

    function _push(call, self)
    {
        self._queue.push(call);
        //событие поступления вызова в очередь
        let callFromFloorRegisteredEvent = _createCallFromFloorRegisteredEvent(call);
        document.dispatchEvent(callFromFloorRegisteredEvent);
    }

    function _createCallFromFloorRegisteredEvent(call)
    {
        return new CustomEvent('callFromFloorRegistered', {
            detail: {
                call: call
            }
        });
    }

    function _queueHandler(self)
    {
        //console.log(Date.now(), '_queueHandler');
        if (self.getQueue().length > 0) {
            //FIFO stack
            let call = self.getQueue().shift();
            console.log('обработка вызова из очереди', call);
        } else {
            //console.log('очереди вызова пуста');
        }
    }

    root.registerModule({
        id: 'callQueueBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);