;(function(root) {

    function init()
    {
    }

    function createView(building)
    {
        let floors = building.getFloors();

        let buildingView = document.createElement('div');

        let table = document.createElement('table');
        let tr1 = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = "Этаж";
        tr1.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = "Кнопки вызова";
        tr1.appendChild(th2);
        let th3 = document.createElement('th');
        th3.innerHTML = "Местоположение лифта";
        tr1.appendChild(th3);
        table.appendChild(tr1);

        for (let floorNumber = floors.length - 1; floorNumber >= 0; floorNumber--) {
            let tr = _createTr(floors, floorNumber);
            table.appendChild(tr);
        }

        let elevators = building.getElevators();
        for (let elevatorNumber = elevators.length - 1; elevatorNumber >= 0; elevatorNumber--) {
            _initElevatorPosition(elevators[elevatorNumber], table);
        }

        buildingView.appendChild(table);

        return buildingView;
    }

    function createControlPanelsView(_building)
    {
        let container = document.createElement('div');

        let elevators = _building.getElevators();
        for (let elevatorIndex = 0, l = elevators.length; elevatorIndex < l; elevatorIndex++) {
            let elevator = elevators[elevatorIndex];
            let controlPanel = elevator.getControlPanel();
            let controlPanelView = controlPanel.getView();
            container.append(controlPanelView);
        }

        return container;
    }

    function _createTr(floors, floorNumber)
    {
        let tr2 = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = floors[floorNumber].getNumber();
        tr2.appendChild(td1);
        let td2 = document.createElement('td');
        let callPanel = floors[floorNumber].getCallPanel();
        let callPanelView = callPanel.getView();
        td2.appendChild(callPanelView);
        tr2.appendChild(td2);
        let td3 = document.createElement('td');
        td3.innerHTML = "";
        tr2.appendChild(td3);

        return tr2;
    }

    function _initElevatorPosition(elevator, table)
    {
        // коллекция "этажей"
        let trCollection = table.getElementsByTagName('tr');
        if (!trCollection) {
            return;
        }
        // "первый этаж"
        let lastTr = trCollection.item(trCollection.length-1);
        if (!lastTr) {
            return;
        }
        // столбец "Местоположение лифта"
        let tdCollection = lastTr.getElementsByTagName('td');
        let lastTd = tdCollection.item(tdCollection.length-1);
        // lastTd.innerHTML = elevator.getView();
        lastTd.appendChild(elevator.getView());
    }

    root.registerModule({
        id: 'builder.render',
        init: init,
        createView: createView,
        createControlPanelsView: createControlPanelsView,
    });

})(window.ElevatorSimulator2021);