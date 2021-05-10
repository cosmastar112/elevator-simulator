;(function(root) {

    let _obj;
    let _peopleCounter = 0;

    const CLASS_NAME_DEFAULT = 'person-default';

    function init()
    {
        _obj = {
            _id: null,
            _loadingFloor: null,
            _unloadingFloor: null,
            _weight: null,
            _view: null,
            getView: function() {
                return this._view;
            },
            getId: function() {
                return this._id;
            },
            getLoadingFloor: function() {
                return this._loadingFloor;
            },
            getUnloadingFloor: function() {
                return this._unloadingFloor;
            },
            getWeight: function() {
                return this._weight;
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
        let view = document.createElement('span');
        view.innerHTML = id;
        view.classList.add(CLASS_NAME_DEFAULT);

        return view;
    }

    root.registerModule({
        id: 'personBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);