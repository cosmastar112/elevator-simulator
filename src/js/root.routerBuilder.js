;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
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

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        //очередь вызова
        newObj._callQueue = _createCallQueue();

        //запуск цикла работы обработчика очереди
        newObj._callQueueHandlerIntervalID = setInterval(function() {
            _callQueueHandler(newObj);
        }, 1000);

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
        } else {
            //console.log('очереди вызова пуста');
        }
    }

    root.registerModule({
        id: 'routerBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);