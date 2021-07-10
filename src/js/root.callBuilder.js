;(function(root) {

    let _obj;
    let counter = 0;

    const CALLTYPE_CABIN = 'cabin';
    const CALLTYPE_FLOOR = 'floor';

    function init()
    {
        _obj = {
            _id: null,
            _type: null,
            _floor: null,
            _direction: null,
            _created_at: null,
            _registered_at: null,
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
            getCreatedAt: function() {
                return this._created_at;
            },
            setRegisteredAt: function() {
                this._registered_at = root.getUtils().generateAtDateString();
            },
            getRegisteredAt: function() {
                return this._registered_at;
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
        newObj._created_at = root.getUtils().generateAtDateString();
        newObj._registered_at = null;


        return newObj;
    }

    root.registerModule({
        id: 'callBuilder',
        init: init,
        construct: construct,
        CALLTYPE_CABIN: CALLTYPE_CABIN,
        CALLTYPE_FLOOR: CALLTYPE_FLOOR,
    });

})(window.ElevatorSimulator2021);