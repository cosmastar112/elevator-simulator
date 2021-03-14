;(function(root) {

    let _building;

    function init()
    {
        _building = {
            _floors: [],
            _ready: false,
            getFloors: function() {
                return this._floors;
            }
        };
    }

    function constructBuilding(systemParams)
    {
        console.log('Создание здания...');
        console.log(systemParams);

        if (_building._ready) {
            return _building;
        }

        // создать указанное количество этажей
        _buildFloors(systemParams.total_floors);
        
        // systemParams.total_elevators
        // systemParams.lifting_power

        // конструирование объекта упешно заверешено
        _building._ready = true;

        return _building;
    }

    function getBuilding()
    {
        return _building;
    }

    function _buildFloors(count)
    {
        let floorBuilder = root.getFloorBuilder();
        for (let floorNumber = 1; floorNumber <= count; floorNumber++) {
            let floor = floorBuilder.constructFloor({ number: floorNumber });
            _building._floors.push(floor);
        }
    }

    root.registerModule({
        id: 'builder',
        init: init,
        constructBuilding: constructBuilding,
        getBuilding: getBuilding,
    });

})(window.ElevatorSimulator2021);