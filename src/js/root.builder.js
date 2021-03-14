;(function(root) {

    let _building;

    function init()
    {
        _building = {
            _floors: [],
            _ready: false,
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
        for (let floorNumber = 0; floorNumber < count; floorNumber++) {
            let floor = { number: floorNumber };
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