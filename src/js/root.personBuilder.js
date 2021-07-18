;(function(root) {

    let _obj;
    let _peopleCounter = 0;

    const CLASS_NAME_DEFAULT = 'person-default';

    const MIN_WEIGHT = 45;
    const MAX_WEIGHT = 120;

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
            setUnloadingFloor: function(value) {
                this._unloadingFloor = value;
                _notifyAboutUnloadingFloorUpdated(this.getId(), value);
            },
            chooseUnloadingFloor: function(params) {
                let floor = root.getPersonUnloadingFloorBuilder().construct(params);
                this.setUnloadingFloor(floor);

                return floor;
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
        let weight = root.getUtils().getRandomIntInclusive(MIN_WEIGHT, MAX_WEIGHT);
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

    //@param personId int id персоны
    //@param value int этаж назначения
    function _notifyAboutUnloadingFloorUpdated(personId, value)
    {
        let newCustomEvent = new CustomEvent('personUnloadingFloorUpdated', {
            detail: {
                personId: personId,
                value: value,
            }
        });
        document.dispatchEvent(newCustomEvent);
    }

    root.registerModule({
        id: 'personBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);