;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_calls';
    const TABLE_ID = 'panel_calls_table';

    function init()
    {
        _obj = {
            _name: 'Вызовы (debug)',
            _view: null,
            getView: function() {
                return this._view;
            },
            getCounter: function() {
                let view = this.getView();
                let trNodeList = view.querySelectorAll('#' + TABLE_ID + ' tr');
                let counter = trNodeList.length;

                return counter;
            },
            updateView: _updateView,
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
        th2.innerHTML = 'Тип';
        let th3 = document.createElement('th');
        th3.innerHTML = 'Этаж назначения';
        let th4 = document.createElement('th');
        th4.innerHTML = 'Лифт';

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        table.appendChild(tr);

        return table;
    }

    function _updateView(callConfig)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);

        //создать новую строку
        let row = _createRow.call(this, callConfig);
        table.appendChild(row);
    }

    function _createRow(callConfig)
    {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.innerHTML = this.getCounter();
        let td2 = document.createElement('td');
        td2.innerHTML = callConfig.type;
        let td3 = document.createElement('td');
        td3.innerHTML = callConfig.unloadingFloor;
        let td4 = document.createElement('td');
        td4.innerHTML = null;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        return tr;
    }

    root.registerModule({
        id: 'panelCalls',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);