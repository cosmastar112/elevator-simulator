;(function(root) {

    let _obj;
    let _peopleCounter = 0;

    function init()
    {
        _obj = {
            _id: null,
            _loadingFloor: null,
            _loadingFloor: null,
            _weight: null,
            _view: null,
            getView: function() {
                return this._view;
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);

        newObj._id = ++_peopleCounter;
        newObj._loadingFloor = params.loadingFloor;
        //вес
        let weight = 45;
        newObj._weight = weight;
        newObj._view = _createView(newObj._id);

        return newObj;
    }

    function _createView(id)
    {
        let view = document.createElement('div');
        view.innerHTML = id;

        return view;
    }

    root.registerModule({
        id: 'personBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);