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

        return newObj;
    }

    root.registerModule({
        id: 'routerBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);