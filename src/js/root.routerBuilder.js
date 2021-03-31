;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _callQueue: null,
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        //очередь вызова
        newObj._callQueue = _createCallQueue();

        return newObj;
    }

    function _createCallQueue()
    {
        let callQueueBuilder = root.getCallQueueBuilder();
        let callQueue = callQueueBuilder.construct();

        return callQueue;
    }

    root.registerModule({
        id: 'routerBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);