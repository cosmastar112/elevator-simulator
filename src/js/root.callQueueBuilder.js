;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _queue: [],
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);

        return newObj;
    }

    root.registerModule({
        id: 'callQueueBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);