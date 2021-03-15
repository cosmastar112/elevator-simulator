;(function(root) {

    let _building;

    function init()
    {
        _building = {
            _floors: [],
            _elevators: [],
            _view: null,
            _ready: false,
            getFloors: function() {
                return this._floors;
            },
            getElevators: function() {
                return this._elevators;
            },
            getView: function() {
                return this._view;
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
        _buildElevators(systemParams.total_elevators);
        // systemParams.lifting_power

        // создать представление
        _building._view = _createView();

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

    function _buildElevators(count)
    {
        let elevatorBuilder = root.getElevatorBuilder();
        for (let elevatorNumber = 1; elevatorNumber <= count; elevatorNumber++) {
            let elevator = elevatorBuilder.construct({ number: elevatorNumber });
            _building._elevators.push(elevator);
        }
    }

    function _createView()
    {
        let buildingRender = root.getBuildingRender();
        let buildingView = buildingRender.createView(_building);

        return buildingView;
    }

    root.registerModule({
        id: 'builder',
        init: init,
        constructBuilding: constructBuilding,
        getBuilding: getBuilding,
    });

})(window.ElevatorSimulator2021);