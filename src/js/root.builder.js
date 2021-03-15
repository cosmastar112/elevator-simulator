;(function(root) {

    let _building;

    function init()
    {
        _building = {
            _floors: [],
            _elevators: [],
            _view: null,
            _controlPanelsView: null,
            _ready: false,
            getFloors: function() {
                return this._floors;
            },
            getElevators: function() {
                return this._elevators;
            },
            getControlPanelsView: function() {
                return this._controlPanelsView;
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
        _buildElevators(systemParams.total_elevators, systemParams.lifting_power);

        // создать представление здания
        _building._view = _createView();
        // создать представление панелей управления
        _building._controlPanelsView = _createControlPanelsView();

        // конструирование объекта успешно завершено
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

    function _buildElevators(count, lifting_power)
    {
        let elevatorBuilder = root.getElevatorBuilder();
        for (let elevatorNumber = 1; elevatorNumber <= count; elevatorNumber++) {
            let elevator = elevatorBuilder.construct({ number: elevatorNumber, lifting_power: lifting_power });
            _building._elevators.push(elevator);
        }
    }

    function _createView()
    {
        let buildingRender = root.getBuildingRender();
        let buildingView = buildingRender.createView(_building);

        return buildingView;
    }

    function _createControlPanelsView()
    {
        let render = root.getBuildingRender();
        let view = render.createControlPanelsView(_building);

        return view;
    }

    root.registerModule({
        id: 'builder',
        init: init,
        constructBuilding: constructBuilding,
        getBuilding: getBuilding,
    });

})(window.ElevatorSimulator2021);