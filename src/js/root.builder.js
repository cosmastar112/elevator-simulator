;(function(root) {

    let _building;

    function init()
    {
        _building = {
            _floors: [],
            _elevators: [],
            _router: null,
            _view: null,
            _controlPanelsView: null,
            _ready: false,
            _subpanels: {
                _callsPanel: null,
                _view: null,
                getСallsPanel: function() {
                    return this._callsPanel;
                },
                getView: function() {
                    return this._view;
                }
            },
            getFloors: function() {
                return this._floors;
            },
            getFloorByNumber: function(floorNumber) {
                let floor = this._floors.find(function(item) {
                    return item._number === floorNumber;
                });
                return floor;
            },
            getElevators: function() {
                return this._elevators;
            },
            getControlPanelsView: function() {
                return this._controlPanelsView;
            },
            getView: function() {
                return this._view;
            },
            //количество этажей в здании
            getTotalFloors: function() {
                return this._floors.length;
            },
            getRouter: function() {
                return this._router;
            },
            stopRouter: function() {
                this._router.destruct();
            },
            //определить лифт в котором находится пассажир (по id пассажира)
            getElevatorByPassengerId: function(passengerId) {
                let elevator = this.getElevators().find(function(elevator) {
                    return elevator.isPassengerInCabin(passengerId);
                });

                return elevator;
            },
            getElevatorByNumber: function(elevatorNumber) {
                let elevator = this.getElevators().find(function(item) {
                    return item.getNumber() === elevatorNumber;
                });

                return elevator;
            },
            getSubpanels: function() {
                return this._subpanels;
            },
            getSubpanelsView: function() {
                return this._subpanels.getView();
            },
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
        _buildElevators(systemParams.total_elevators, systemParams.lifting_power, systemParams.total_floors);
        //маршрутизатор
        _buildRouter();
        _buildSubpanels();

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
            let floor = floorBuilder.constructFloor({ number: floorNumber, totalFloors: count });
            _building._floors.push(floor);
        }
    }

    function _buildElevators(count, lifting_power, total_floors)
    {
        let elevatorBuilder = root.getElevatorBuilder();
        for (let elevatorNumber = 1; elevatorNumber <= count; elevatorNumber++) {
            let elevator = elevatorBuilder.construct({ number: elevatorNumber, lifting_power: lifting_power, total_floors: total_floors });
            _building._elevators.push(elevator);
        }
    }

    function _buildRouter()
    {
        let routerBuilder = root.getRouterBuilder();
        _building._router = routerBuilder.construct({elevators: _building._elevators});
    }

    function _buildSubpanels()
    {
        let panelCallsBuilder = root.getPanelCalls();
        _building._subpanels._callsPanel = panelCallsBuilder.construct();

        //создать представление доп. панелей
        let render = root.getBuildingRender();
        let view = render.createSubpanelsView();
        _building._subpanels._view = view;
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