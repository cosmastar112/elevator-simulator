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
            },
            //удалить группу людей с этажа
            removePeople: function() {
                this._people = null;
                this._hasPeople = null;
            }
        };
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
            let floor = event.detail.call.getFloor();
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

        console.log('Отжать кнопки вызова на панели на этаже', event.detail, callPanel);
    }

    //@return array
    function _loadPassengers(people, floor, elevator)
    {
        console.log('Погрузка пассажиров...', people);
        //успешно погруженные пассажиры
        let loadedPersons = [];

        //на этаже нет группы людей
        if (!people) {
            return loadedPersons;
        }

        while (!people.isEmpty()) {
            let person = people.detachPerson();
            //попытаться его погрузить
            if (_loadPerson(person)) {
                //если погрузка прошла успешно (перегруз не наступил), добавить его в список погруженных пассажиров
                loadedPersons.push(person);
                //добавить пассажира в хранилище "пассажиры в кабине"
                elevator.attachPassenger(person);
            } else {
                //если наступил перегруз, устранить его
                _fixOverweight();
            }
        }

        //убрать пустую группу людей с этажа
        floor.removePeople();

        return loadedPersons;
    }

    //погрузка пассажира в кабину лифта
    function _loadPerson(person)
    {
        let weight = person.getWeight();
        //пока что выполняется ВСЕГДА успешно
        return true;
    }

    function _fixOverweight()
    {

    }

    //погрузка
    function loading(floorNumber, elevator)
    {
        //этаж
        let floor = root.getBuilder().getBuilding().getFloorByNumber(floorNumber);
        //найти группу людей на указанном этаже
        let people = floor.getPeople();
        //успешно погруженные пассажиры
        let loadedPersons = _loadPassengers(people, floor, elevator);

        return loadedPersons;
    }

    root.registerModule({
        id: 'floorBuilder',
        init: init,
        constructFloor: constructFloor,
        loading: loading,
    });

})(window.ElevatorSimulator2021);