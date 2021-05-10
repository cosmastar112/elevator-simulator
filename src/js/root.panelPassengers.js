;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_passengers';
    const TABLE_ID = 'panel_passengers_table';

    function init()
    {
        _obj = {
            _name: 'Пассажиры (debug)',
            _view: null,
            getView: function() {
                return this._view;
            },
            updateView: _updateView
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        newObj._view = _createView(_obj);

        return newObj;
    }

    function _createView(self)
    {
        let view = document.createElement('div');
        view.classList.add(CLASS_NAME);
        //название панели
        let panelTitle = document.createElement('h3');
        panelTitle.innerHTML = self._name;
        view.appendChild(panelTitle);

        //таблица
        let table = _createTable();
        view.appendChild(table);

        return view;
    }

    function _createTable()
    {
        let table = document.createElement('table');
        table.id = TABLE_ID;
        let tr = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = 'Id';
        let th2 = document.createElement('th');
        th2.innerHTML = 'Этаж погрузки';
        let th3 = document.createElement('th');
        th3.innerHTML = 'Этаж выгрузки';
        let th4 = document.createElement('th');
        th4.innerHTML = 'Вес';

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        table.appendChild(tr);

        return table;
    }

    function _updateView(action, people)
    {
        console.log('panelPassengers._updateView', action, people);
        if (action === 'add') {
            //добавить строки
            let persons = people.getPersons();
            persons.forEach(function(person) {
                let id = person.getId();
                let loadingFloor = person.getLoadingFloor();
                let unloadingFloor = person.getUnloadingFloor();
                let weight = person.getWeight();
                //создать строку
                let tr = _createTr(id, loadingFloor, unloadingFloor, weight);
                //добавить строку в таблицу
                let table = document.getElementById(TABLE_ID);
                table.appendChild(tr);
            });
        }
    }

    //добавить строку
    function _createTr(id, loadingFloor, unloadingFloor, weight)
    {
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        tdId.innerHTML = id;
        let tdLoadingFloor = document.createElement('td');
        tdLoadingFloor.innerHTML = loadingFloor;
        let tdUnloadingFloor = document.createElement('td');
        tdUnloadingFloor.innerHTML = unloadingFloor;
        let tdWeight = document.createElement('td');
        tdWeight.innerHTML = weight;

        tr.appendChild(tdId);
        tr.appendChild(tdLoadingFloor);
        tr.appendChild(tdUnloadingFloor);
        tr.appendChild(tdWeight);

        return tr;
    }

    root.registerModule({
        id: 'panelPassengers',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);