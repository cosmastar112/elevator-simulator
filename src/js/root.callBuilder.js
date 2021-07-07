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
            _created_at: null,
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
            getCreatedAt: function() {
                return this._created_at;
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
        newObj._created_at = _generateCreatedAtString();


        return newObj;
    }

    function _generateCreatedAtString()
    {
        let dateObj = new Date();
        let created_at = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString() + ' ' + dateObj.getMilliseconds();

        return created_at;
    }

    root.registerModule({
        id: 'callBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);