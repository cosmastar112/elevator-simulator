;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_passengers';
    const TABLE_ID = 'panel_passengers_table';

    const CLASS_TD_UNLOADING_FLOOR_DEFAULT = 'panel_passengers_table_td-unloadingfloor';
    const CLASS_TR_DETACHED = 'panel_passengers_table_tr-detached';
    const DEBUG_PANEL_TITLE_CLASS = 'debug-panel__title';

    function init()
    {
        _obj = {
            _name: 'Пассажиры (debug)',
            _view: null,
            getView: function() {
                return this._view;
            },
            updateView: _updateView,
            updateView_PassengerUnloadingFloor: _updateView_PassengerUnloadingFloor,
            updateView_passengerDetached: _updateView_passengerDetached,
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
        let panelTitle = document.createElement('div');
        panelTitle.innerHTML = self._name;
        panelTitle.classList.add(DEBUG_PANEL_TITLE_CLASS);
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

    function _updateView(action, persons)
    {
        console.log('panelPassengers._updateView', action, persons);
        if (action === 'add') {
            //добавить строки
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

    //обновить значение в столбце «Этаж выгрузки» соответствующей записи
    function _updateView_PassengerUnloadingFloor(id, value)
    {
        let view = this.getView();
        // console.log(view);
        if (view) {
            let tr = _getRowByDataKey(view, id);
            let td = _getUnloadingFloorTdFromTr(tr);
            if (td) {
                td.innerHTML = value;
            }
        }
    }

    //добавить строку
    function _createTr(id, loadingFloor, unloadingFloor, weight)
    {
        let tr = document.createElement('tr');
        //id строки
        tr.dataset.key = id;
        let tdId = document.createElement('td');
        tdId.innerHTML = id;
        let tdLoadingFloor = document.createElement('td');
        tdLoadingFloor.innerHTML = loadingFloor;
        let tdUnloadingFloor = document.createElement('td');
        tdUnloadingFloor.classList.add(CLASS_TD_UNLOADING_FLOOR_DEFAULT);
        tdUnloadingFloor.innerHTML = unloadingFloor;
        let tdWeight = document.createElement('td');
        tdWeight.innerHTML = weight;

        tr.appendChild(tdId);
        tr.appendChild(tdLoadingFloor);
        tr.appendChild(tdUnloadingFloor);
        tr.appendChild(tdWeight);

        return tr;
    }

    function _getRowByDataKey(view, key)
    {
        let selector = '#' + TABLE_ID + ' tr[data-key="' + key + '"]';
        let tr = view.querySelector(selector);

        return tr;
    }

    function _getUnloadingFloorTdFromTr(tr)
    {
        let td = tr.querySelector('td.' + CLASS_TD_UNLOADING_FLOOR_DEFAULT);
        return td;
    }

    //выделить соответствующую строку, чтобы показать, что пассажир вышел из кабины
    function _updateView_passengerDetached(id)
    {
        let view = this.getView();
        if (view) {
            let tr = _getRowByDataKey(view, id);
            tr.classList.add(CLASS_TR_DETACHED);
        }
    }

    root.registerModule({
        id: 'panelPassengers',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);