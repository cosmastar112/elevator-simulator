;(function(root) {

    let _obj;
    let counter = 0;

    function init()
    {
        _obj = {
            _id: null,
            _type: null,
            _floor: null,
            _direction: null,
            _fromCabin: null,
            getId: function() {
                return this._id;
            },
            getType: function() {
                return this._type;
            },
            getFloor: function() {
                return this._floor;
            },
            getDirection: function() {
                return this._direction;
            },
            getFromCabin: function() {
                return this._fromCabin;
            },
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        newObj._id = ++counter;
        newObj._type = params.type;
        newObj._floor = params.floor;
        newObj._direction = params.direction;
        newObj._fromCabin = params.fromCabin;

        return newObj;
    }

    root.registerModule({
        id: 'callBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);