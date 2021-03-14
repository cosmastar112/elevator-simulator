;(function(root) {

    let _building;

    function init()
    {
        _building = {
            _floors: [],
            _view: null,
            _ready: false,
            getFloors: function() {
                return this._floors;
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
        
        // systemParams.total_elevators
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

    function _createView()
    {
        let _floors = _building.getFloors();

        let buildingView = document.createElement('div');

        for (let floorNumber = _floors.length - 1; floorNumber >= 0; floorNumber--) {
            let floorView = _floors[floorNumber].getView();
            buildingView.appendChild(floorView);
        }

        return buildingView;
    }

    root.registerModule({
        id: 'builder',
        init: init,
        constructBuilding: constructBuilding,
        getBuilding: getBuilding,
    });

})(window.ElevatorSimulator2021);