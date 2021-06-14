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
            }
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

        tr.appendChild(th1);
        tr.appendChild(th2);
        table.appendChild(tr);

        return table;
    }

    root.registerModule({
        id: 'panelCalls',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);