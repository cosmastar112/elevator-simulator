;(function(root) {

    let obj;

    function init()
    {
        obj = {
            unload: _unloadPassengers,
            load: _loading,
            hasPassengersWhoWillUnload: _hasPassengersWhoWillUnload
        }
    }

    function construct()
    {
        let newObj = Object.assign({}, obj);

        return newObj;
    }

    function _unloadPassengers(self)
    {
        let currentFloor = self.getCurrentPosition();
        //пока в кабине есть пассажиры, которые прибыли на этаж назначения
        while(_hasPassengersWhoWillUnload(self)) {

            let passengersInCabin = self.getPassengersInCabin();
            //выгружать таких пассажиров
            for (let passengerIndex = 0, l = passengersInCabin.length; passengerIndex < l; passengerIndex++) {
                let currentPassenger = passengersInCabin[passengerIndex];
                let ufloor = currentPassenger.getUnloadingFloor();
                if (ufloor && ufloor === currentFloor) {
                    let pId = currentPassenger.getId();
                    console.log('Пассажир ' + pId + ' прибыл на этаж назначения (' + currentFloor + ') и вышел из лифта');
                    self.detachPassenger(pId);
                    _notifyAboutPassengerDetached(pId, self.getNumber());
                    break;
                }
            }

        }
    }

    function _hasPassengersWhoWillUnload(self)
    {
        let willUnload = false;

        let currentFloor = self.getCurrentPosition();
        let passengersInCabin = self.getPassengersInCabin();
        for (let passengerIndex = 0, l = passengersInCabin.length; passengerIndex < l; passengerIndex++) {
            let currentPassenger = passengersInCabin[passengerIndex];
            let ufloor = currentPassenger.getUnloadingFloor();
            if (ufloor && ufloor === currentFloor) {
                willUnload = true;
                break;
            }
        }

        return willUnload;
    }

    function _notifyAboutPassengerDetached(pId, eId)
    {
        let event = new CustomEvent('passengerDetached', {
            detail: {
                pId: pId,
                eId: eId,
            }
        });
        document.dispatchEvent(event);
    }

    //погрузка
    function _loading(floorNumber, elevator)
    {
        //этаж
        let floor = root.getBuilder().getBuilding().getFloorByNumber(floorNumber);
        //найти группу людей на указанном этаже
        let people = floor.getPeople();
        //успешно погруженные пассажиры
        let loadedPersons = _loadPassengers(people, floor, elevator);

        return loadedPersons;
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

    function _loadPerson(person)
    {
        let weight = person.getWeight();
        //пока что выполняется ВСЕГДА успешно
        return true;
    }

    function _fixOverweight()
    {

    }

    root.registerModule({
        id: 'loadingAndUnloadingManager',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);