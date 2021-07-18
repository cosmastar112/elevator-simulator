;(function(root) {

    function init()
    {
        //слушать событие "группа людей создана"; реагирование: отрисовать группу людей
        document.addEventListener('peopleCreated', _peopleCreatedHandler);
        document.addEventListener('elevatorPositionUpdated', _elevatorPositionUpdatedHandler);
        //слушать событие "погрузка пассажиров завершена"; реагирование: перерисовать группу людей на этаже
        document.addEventListener('elevatorLoadingCompleted', _elevatorLoadingCompletedHandler);
        //модель панели "Количество пассажиров" изменена; реагирование: перерисовать view панели
        document.addEventListener('panelPersonsTotalNumModelUpdated', _panelPersonsTotalNumModelUpdatedHandler);
        //модель панели "Общий вес пассажиров" изменена; реагирование: перерисовать view панели
        document.addEventListener('panelPersonsTotalWeightModelUpdated', _panelPersonsTotalWeightModelUpdatedHandler);
        //слушать событие "назначение этажа погрузки пассажира"; реагирование: перерисовать соответствующее значение на дебаг-панели
        document.addEventListener('personUnloadingFloorUpdated', _personUnloadingFloorUpdatedHandler);
        //слушать событие "создан вызов с этажа"; реагирование: отрисовать соответствующее значение на дебаг-панели
        document.addEventListener('elevatorCallFromFloorCreated', _elevatorCallCreatedHandler);
        //слушать событие "создан вызов из кабины"; реагирование: отрисовать соответствующее значение на дебаг-панели
        document.addEventListener('elevatorCallFromCabinCreated', _elevatorCallCreatedHandler);
        //слушать событие "вызову назначен исполнитель (лифт)"; реагирование: перерисовать соответствующее значение на дебаг-панели
        document.addEventListener('elevatorCallAllocated', _elevatorCallAllocatedHandler);
        //слушать событие "вызов зарегистрирован"; реагирование: перерисовать соответствующее значение на дебаг-панели
        document.addEventListener('callFromFloorRegistered', _elevatorCallRegisteredHandler);
        document.addEventListener('callFromCabinRegistered', _elevatorCallRegisteredHandler);
        document.addEventListener('callProcessingStarted', _elevatorCallProcessingStartedHandler);
        document.addEventListener('callProcessingFinished', _elevatorCallProcessingFinishedHandler);
        //слушать событие "пассажир вышел из кабины лифта"; реагирование: выделить соответствующую строку на дебаг-панели
        document.addEventListener('passengerDetached', _passengerDetachedHandler);
        //перегруз в лифте
        document.addEventListener('elevatorOverweight', _elevatorOverweightHandler);
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
        th3.innerHTML = "Группа людей";
        tr1.appendChild(th3);
        let th4 = document.createElement('th');
        th4.innerHTML = "Местоположение лифта";
        tr1.appendChild(th4);
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
        tr2.id = _getFloorId(floors[floorNumber].getNumber());

        let td1 = document.createElement('td');
        td1.innerHTML = floors[floorNumber].getNumber();
        tr2.appendChild(td1);
        let td2 = document.createElement('td');
        let callPanel = floors[floorNumber].getCallPanel();
        let callPanelView = callPanel.getView();
        td2.appendChild(callPanelView);
        tr2.appendChild(td2);
        let td3 = document.createElement('td');
        td3.className = "column_people";
        td3.innerHTML = "";
        tr2.appendChild(td3);
        let td4 = document.createElement('td');
        td4.className = "elevator_position";
        td4.innerHTML = "";
        tr2.appendChild(td4);

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

    function _peopleCreatedHandler(event)
    {
        //этаж, на котором должна быть размещена группа людей
        let loadingFloor = event.detail.people.getLoadingFloor();
        //идентификатор строки
        let floorId = _getFloorId(loadingFloor);
        //найти строку таблицы, соответствующую этажу
        let row = document.getElementById('floor_'+loadingFloor);
        //найти ячейку строки, в которой размещается группа людей (коллекция)
        let tdCollection = row.getElementsByClassName('column_people');
        //извлечь ячейку из коллекции
        let td = tdCollection.item(0);

        //view группы людей
        let peopleView = event.detail.people.getView();
        //отрисовать группу людей в ячейке
        td.appendChild(peopleView);
        // console.log('_peopleCreatedHandler', event, loadingFloor, row, td);
    }

    function _elevatorPositionUpdatedHandler(event)
    {
        // console.log('_elevatorPositionUpdatedHandler', event.detail);
        //старая позиция
        let oldPosition = event.detail.oldPosition;
        _updateOldPosition(oldPosition);
        //новая позиция
        let newPosition = event.detail.newPosition;
        _updateNewPosition(newPosition, event.detail.elevator);
    }

    function _updateOldPosition(oldPosition)
    {
        //id строки
        let trId = _getFloorId(oldPosition);
        //строка
        let tr = document.getElementById(trId);
        //ячейка с местоположением
        let td = tr.querySelector('td.elevator_position');
        // console.log(tr);
        // console.log(td);
        //очистка рендера лифта
        while (td.firstChild) {
            td.removeChild(td.lastChild);
        }
    }

    function _updateNewPosition(newPosition, elevator)
    {
        //id строки
        let trId = _getFloorId(newPosition);
        //строка
        let tr = document.getElementById(trId);
        //ячейка с местоположением
        let td = tr.querySelector('td.elevator_position');
        // console.log(tr);
        // console.log(td);
        td.appendChild(elevator.getView());
    }

    function _getFloorId(number)
    {
        return 'floor_'+number;
    }

    //обработчик события "погрузка пассажиров завершена"
    function _elevatorLoadingCompletedHandler(event)
    {
        console.log('Запуск рендера после завершения погрузки пассажиров', event.detail);
        // console.log(event.detail);

        //номер этажа
        let floorNumber = event.detail.floorNumber;
        //лифт
        let elevator = event.detail.elevator;
        //погруженные люди
        let loadedPersons = event.detail.loadedPersons;

        //запускать рендер только в случае если пассажиры были погружены
        if (loadedPersons.length > 0) {
            ////А. перерисовка группы людей
            //1. найти строку в которой располагается вид группы людей
            //id строки
            let trId = _getFloorId(floorNumber);
            //строка
            let tr = document.getElementById(trId);
            //ячейка
            let td = tr.querySelector('td.column_people');
            //2. удалить старый вид
            while (td.firstChild) {
                td.removeChild(td.lastChild);
            }
            //3.создать новый вид
            //этаж
            let floor = root.getBuilder().getBuilding().getFloorByNumber(floorNumber);
            //группа людей на этаже
            let people = floor.getPeople();
            //перерисовать группу людей
            if (people) {
                let updatedView = people.updateView();
                td.appendChild(updatedView);
            }
            ////

            ////Б. Отрисовка погруженных пассажиров на debug-панели
            elevator.getControlPanel().getPanelPassengers().updateView('add', loadedPersons);
            ////
        }
    }

    function _panelPersonsTotalNumModelUpdatedHandler(event)
    {
        let elevator = event.detail.elevator;
        //id лифта
        let id = elevator.getNumber();
        //панель управления лифта
        let controlPanel = document.getElementById('control_panel-' + id);
        //старый view панели "Количество пассажиров"
        let panelContainer = controlPanel.querySelector('div.panel_total-persons-num');
        //обновленный view панели "Количество пассажиров"
        let updatedView = elevator.getControlPanel().getPanelPersonsTotalNum().updateView();
        //замена старого view на новый
        controlPanel.replaceChild(updatedView, panelContainer);
    }

    function _panelPersonsTotalWeightModelUpdatedHandler(event)
    {
        let elevator = event.detail.elevator;
        //id лифта
        let id = elevator.getNumber();
        //панель управления лифта
        let controlPanel = document.getElementById('control_panel-' + id);
        //старый view панели
        let panelContainer = controlPanel.querySelector('div.panel_total-persons-weight');
        //обновленный view панели
        let updatedView = elevator.getControlPanel().getPanelPersonsTotalWeight().updateView();
        //замена старого view на новый
        controlPanel.replaceChild(updatedView, panelContainer);
    }

    function _personUnloadingFloorUpdatedHandler(event)
    {
        let personId = event.detail.personId;
        let value = event.detail.value;

        //определить в каком лифте находится пассажир
        let elevator = root.getBuilder().getBuilding().getElevatorByPassengerId(personId);
        // console.log(elevator);
        if (elevator) {
            elevator.getControlPanel().getPanelPassengers().updateView_PassengerUnloadingFloor(personId, value);
        }
    }

    function createSubpanelsView()
    {
        let subpanels = root.getBuilder().getBuilding().getSubpanels();
        let callsPanel = subpanels.getСallsPanel();
        let panelView = callsPanel.getView();

        let container = document.createElement('div');
        container.appendChild(panelView);

        return container;
    }

    function _elevatorCallCreatedHandler(event)
    {
        console.log('Обновление debug-панели вызовов', event.detail);
        let subpanels = root.getBuilder().getBuilding().getSubpanels();
        let callsPanel = subpanels.getСallsPanel();
        let callConfig = _createCallConfig(event.detail.call);

        callsPanel.updateView(callConfig);
    }

    function _createCallConfig(callObject)
    {
        let id = callObject.getId();
        let type = callObject.getType();
        let floor = callObject.getFloor();
        let callConfig = {
            id: id,
            type: type,
            unloadingFloor: floor,
            created_at: callObject.getCreatedAt(),
        };

        return callConfig;
    }

    function _elevatorCallAllocatedHandler(event)
    {
        let call = event.detail.call;
        let callId = call.getId();
        let elevatorNumber = event.detail.elevatorNumber

        console.log('Обновление столбца "лифт" debug-панели вызовов', event.detail);
        let subpanels = root.getBuilder().getBuilding().getSubpanels();
        let callsPanel = subpanels.getСallsPanel();

        callsPanel.updateView_elevator(callId, elevatorNumber);
        callsPanel.updateView_allocated(callId, call.getAllocatedAt());
    }

    function _elevatorCallRegisteredHandler(event)
    {
        let call = event.detail.call;
        let id = call.getId();
        let registeredAt = call.getRegisteredAt();

        console.log('Обновление столбца "время регистрации" debug-панели вызовов', event.detail);
        let subpanels = root.getBuilder().getBuilding().getSubpanels();
        let callsPanel = subpanels.getСallsPanel();

        callsPanel.updateView_registered(id, registeredAt);
    }

    function _elevatorCallProcessingStartedHandler(event)
    {
        let call = event.detail.call;
        let id = call.getId();
        let startedAt = call.getStartedAt();

        console.log('Обновление столбца "время начала обработки" debug-панели вызовов', event.detail);
        let subpanels = root.getBuilder().getBuilding().getSubpanels();
        let callsPanel = subpanels.getСallsPanel();

        callsPanel.updateView_started(id, startedAt);
    }

    function _elevatorCallProcessingFinishedHandler(event)
    {
        let call = event.detail.call;
        let id = call.getId();
        let finishedAt = call.getFinishedAt();

        console.log('Обновление столбца "время окончания обработки" debug-панели вызовов', event.detail);
        let subpanels = root.getBuilder().getBuilding().getSubpanels();
        let callsPanel = subpanels.getСallsPanel();

        callsPanel.updateView_finished(id, finishedAt);
        callsPanel.updateView_trfinished(id);
    }

    function _passengerDetachedHandler(event)
    {
        //id персоны
        let pId = event.detail.pId;
        //id лифта
        let eId = event.detail.eId;

        //определить в каком лифте находится пассажир
        let elevator = root.getBuilder().getBuilding().getElevatorByNumber(eId);
        if (elevator) {
            elevator.getControlPanel().getPanelPassengers().updateView_passengerDetached(pId);
        }
    }

    function _elevatorOverweightHandler(event)
    {
        let elevator = event.detail.elevator;
        let isOverweighted = event.detail.isOverweighted;
        if (elevator) {
            elevator.getControlPanel().getPanelOverweight().updateView_overweight(isOverweighted);
        }
    }

    root.registerModule({
        id: 'builder.render',
        init: init,
        createView: createView,
        createControlPanelsView: createControlPanelsView,
        createSubpanelsView: createSubpanelsView,
    });

})(window.ElevatorSimulator2021);