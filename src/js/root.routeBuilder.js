;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _route: [],
            getRoute: function() {
                return this._route;
            },
            isEmpty: function() {
                let isEmpty = !this._route || !Array.isArray(this._route) || this._route.length < 1;
                return isEmpty;
            },
            add: function(call) {
                this._route.push(call);
            },
            getNearestByDirection: function(direction, elevatorCurrentPosition) {
                if (direction > 0) {
                    //движение наверх
                    let calls = this._route.filter(function(item) {
                        return item.getFloor() > elevatorCurrentPosition;
                    });
                    calls.sort(function(a, b) {
                        return parseInt(a.getFloor()) > parseInt(b.getFloor()) ? 1: -1;
                    });
                    return calls.shift();
                } else if (direction < 0) {
                    //движение вниз
                    let calls = this._route.filter(function(item) {
                        return item.getFloor() < elevatorCurrentPosition;
                    });
                    calls.sort(function(a, b) {
                        return parseInt(a.getFloor()) > parseInt(b.getFloor()) ? 1: -1;
                    });
                    return calls.pop();
                }
            },
            getNearest: function() {
                //последний добавленный
                let lastIndex = this._route.length - 1;
                return this._route[lastIndex];
            },
            getActiveCall: function() {
                let item = this._route.find(function(item) {
                    return item.processing && item.processing === true;
                });
                return item;
            },
            remove: function(call) {
                let itemIndex = this._route.findIndex(function(item) {
                    return item.processing && item.processing === true;
                });
                this._route.splice(itemIndex, 1);
            },
            isCallExists: function(targetFloor) {
                let item = this._route.find(function(item) {
                    return item.getFloor() === targetFloor;
                });

                return item ? true : false;
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);

        return newObj;
    }

    root.registerModule({
        id: 'routeBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);