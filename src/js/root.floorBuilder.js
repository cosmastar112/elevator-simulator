;(function(root) {

    let _floor;

    function init()
    {
        _floor = {
            _number: null,
            getNumber: function() {
                return this._number;
            }
        };
    }

    function constructFloor(floorParams)
    {
        // console.log('Создание этажа...');
        // console.log(floorParams);

        let floor = Object.assign({}, _floor);
        floor._number = floorParams.number;

        return floor;
    }

    root.registerModule({
        id: 'floorBuilder',
        init: init,
        constructFloor: constructFloor,
    });

})(window.ElevatorSimulator2021);