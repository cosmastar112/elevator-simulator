;(function(root) {

    let _floor;

    function init()
    {
        _floor = {
            _number: null,
            _callPanel: null,
            _people: null,
            _hasPeople: null,
            _view: null,
            _callFromFloorRegisteredHandler: null,
            getNumber: function() {
                return this._number;
            },
            getCallPanel: function() {
                return this._callPanel;
            },
            getPeople: function() {
                return this._people;
            },
            getView: function() {
                return this._view;
            }
        };

        //обработчик готовности лифта к погрузке
        document.addEventListener('elevatorReadyForLoading', _elevatorReadyForLoadingHandler);
    }

    function constructFloor(floorParams)
    {
        // console.log('Создание этажа...');
        // console.log(floorParams);

        let floor = Object.assign({}, _floor);
        floor._number = floorParams.number;
        floor._callPanel = _createCallPanel(floorParams);
        // создать представление
        floor._view = _createView(floorParams.number);

        //вызов с этажа поступил в очередь вызова, на этаже необходимо создать группу людей
        floor._callFromFloorRegisteredHandler = _createCallFromFloorRegisteredHandler(floor);
        document.addEventListener('callFromFloorRegistered', floor._callFromFloorRegisteredHandler);

        //обработчик отжатия кнопок вызова
        document.addEventListener('elevatorDoorsClosed', _elevatorDoorsClosedHandler);

        return floor;
    }

    function _createCallFromFloorRegisteredHandler(self)
    {
        let cb = function(event) {
            if (self._hasPeople) {
                // console.log('На этаже уже есть группа людей');
                return;
            }

            //создать группу людей
            let floor = event.detail.call.floor;
            // console.log(self.getNumber(), floor);
            if (self.getNumber() === parseInt(floor)) {
                console.log('Создать на этаже ' + floor + ' группу людей');
                let peopleBuilder = root.getPeopleBuilder();
                self._people = peopleBuilder.construct({floor: floor});
                //запомнить, что на этаже есть группа людей
                self._hasPeople = true;
                //отрисовать группу людей
                let peopleCreatedEvent = _createPeopleCreatedEvent(self._people);
                document.dispatchEvent(peopleCreatedEvent);
            }
        }

        return cb;
    }

    function _createView(floorNumber)
    {
        let view = document.createElement('div');
        view.innerHTML = floorNumber;

        return view;
    }

    function _createPeopleCreatedEvent(people)
    {
        return new CustomEvent('peopleCreated', {
            detail: {
                people: people
            }
        });
    }

    function _createCallPanel(params)
    {
        let callPanelBuilder = root.getCallPanelBuilder();
        let callPanel = callPanelBuilder.construct(params);

        return callPanel;
    }

    //обработчик отжатия кнопок вызова
    function _elevatorDoorsClosedHandler()
    {
        //найти панель вызова указанного этажа
        let floorNumber = event.detail.floor;
        let floor = root.getBuilder().getBuilding().getFloorByNumber(floorNumber);
        let callPanel = floor.getCallPanel();
        callPanel.unpressBtns();

        console.log('Отжать кнопки вызова на панели', event.detail, callPanel);
    }

    //обработчик готовности лифта к погрузке
    function _elevatorReadyForLoadingHandler(event)
    {
        //найти группу людей на указанном этаже
        let floorNumber = event.detail.floorNumber;
        let elevator = event.detail.elevator;
        //этаж
        let floor = root.getBuilder().getBuilding().getFloorByNumber(floorNumber);
        //группа людей
        let people = floor.getPeople();

        console.log('Погрузка пассажиров...', people);
        //имитация асинхронности
        setTimeout(function() {
            //уведомить об окончании погрузки
            let elevatorLoadingCompleteEvent = _createElevatorLoadingCompleteEvent(people, elevator, floorNumber);
            document.dispatchEvent(elevatorLoadingCompleteEvent);
        }, 1000);
    }

    function _createElevatorLoadingCompleteEvent(people, elevator, floorNumber)
    {
        return new CustomEvent('elevatorLoadingComplete', {
            detail: {
                people: people,
                elevator: elevator,
                floorNumber: floorNumber,
            }
        });
    }

    root.registerModule({
        id: 'floorBuilder',
        init: init,
        constructFloor: constructFloor,
    });

})(window.ElevatorSimulator2021);