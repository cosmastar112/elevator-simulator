;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_calls';
    const TABLE_ID = 'panel_calls_table';
    const TD_ELEVATOR_CLASS = 'col-elevator';
    const TD_REGISTERED_CLASS = 'col-registered';
    const TD_ALLOCATED_CLASS = 'col-allocated';
    const TD_STARTED_CLASS = 'col-started';
    const TD_FINISHED_CLASS = 'col-finished';
    const TR_FINISHED_CLASS = 'panel_calls_tr-finished';

    function init()
    {
        _obj = {
            _name: 'Вызовы (debug)',
            _view: null,
            getView: function() {
                return this._view;
            },
            updateView: _updateView,
            updateView_elevator: _updateView_elevator,
            updateView_registered: _updateView_registered,
            updateView_allocated: _updateView_allocated,
            updateView_started: _updateView_started,
            updateView_finished: _updateView_finished,
            updateView_trfinished: _updateView_trfinished,
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
        let th5 = document.createElement('th');
        th5.innerHTML = 'Время создания';
        let th6 = document.createElement('th');
        th6.innerHTML = 'Время регистрации';
        let th7 = document.createElement('th');
        th7.innerHTML = 'Время назначения исполнителя';
        let th8 = document.createElement('th');
        th8.innerHTML = 'Время начала обработки';
        let th9 = document.createElement('th');
        th9.innerHTML = 'Время окончания обработки';

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        tr.appendChild(th6);
        tr.appendChild(th7);
        tr.appendChild(th8);
        tr.appendChild(th9);
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
        tr.dataset.key = callConfig.id;
        let td1 = document.createElement('td');
        td1.innerHTML = callConfig.id;
        let td2 = document.createElement('td');
        td2.innerHTML = callConfig.type;
        let td3 = document.createElement('td');
        td3.innerHTML = callConfig.unloadingFloor;
        let td4 = document.createElement('td');
        td4.innerHTML = null;
        td4.classList.add(TD_ELEVATOR_CLASS);
        let td5 = document.createElement('td');
        td5.innerHTML = callConfig.created_at;
        let td6 = document.createElement('td');
        td6.classList.add(TD_REGISTERED_CLASS);
        td6.innerHTML = null;
        let td7 = document.createElement('td');
        td7.classList.add(TD_ALLOCATED_CLASS);
        td7.innerHTML = null;
        let td8 = document.createElement('td');
        td8.classList.add(TD_STARTED_CLASS);
        td8.innerHTML = null;
        let td9 = document.createElement('td');
        td9.classList.add(TD_FINISHED_CLASS);
        td9.innerHTML = null;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);

        return tr;
    }

    //найти соответствующую строку по callId (data-key строки)
    //и записать в innerHTML элемента td значение elevatorNumber (номер лифта)
    function _updateView_elevator(callId, elevatorNumber)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);
        let trDataKeySelector = 'tr[data-key="' + callId + '"]';
        let tr = table.querySelector(trDataKeySelector);
        let td = tr.getElementsByClassName(TD_ELEVATOR_CLASS);
        if (td.length > 0) {
            td.item(0).innerHTML = elevatorNumber;
        }
    }

    //найти соответствующую строку по callId (data-key строки)
    //и записать в innerHTML элемента td значение registeredAt (время регистрации)
    function _updateView_registered(callId, registeredAt)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);
        let trDataKeySelector = 'tr[data-key="' + callId + '"]';
        let tr = table.querySelector(trDataKeySelector);
        let td = tr.getElementsByClassName(TD_REGISTERED_CLASS);
        if (td.length > 0) {
            td.item(0).innerHTML = registeredAt;
        }
    }

    //найти соответствующую строку по callId (data-key строки)
    //и записать в innerHTML элемента td значение allocatedAt (время назначения исполнителя)
    function _updateView_allocated(callId, allocatedAt)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);
        let trDataKeySelector = 'tr[data-key="' + callId + '"]';
        let tr = table.querySelector(trDataKeySelector);
        let td = tr.getElementsByClassName(TD_ALLOCATED_CLASS);
        if (td.length > 0) {
            td.item(0).innerHTML = allocatedAt;
        }
    }

    //найти соответствующую строку по callId (data-key строки)
    //и записать в innerHTML элемента td значение startedAt (время начала обработки вызова)
    function _updateView_started(callId, startedAt)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);
        let trDataKeySelector = 'tr[data-key="' + callId + '"]';
        let tr = table.querySelector(trDataKeySelector);
        let td = tr.getElementsByClassName(TD_STARTED_CLASS);
        if (td.length > 0) {
            td.item(0).innerHTML = startedAt;
        }
    }

    //найти соответствующую строку по callId (data-key строки)
    //и записать в innerHTML элемента td значение finishedAt (время окончания обработки вызова)
    function _updateView_finished(callId, finishedAt)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);
        let trDataKeySelector = 'tr[data-key="' + callId + '"]';
        let tr = table.querySelector(trDataKeySelector);
        let td = tr.getElementsByClassName(TD_FINISHED_CLASS);
        if (td.length > 0) {
            td.item(0).innerHTML = finishedAt;
        }
    }

    //найти соответствующую строку по callId (data-key строки) и выделить её как "обработана"
    function _updateView_trfinished(callId)
    {
        let view = this.getView();
        let table = view.querySelector('#' + TABLE_ID);
        let trDataKeySelector = 'tr[data-key="' + callId + '"]';
        let tr = table.querySelector(trDataKeySelector);
        tr.classList.add(TR_FINISHED_CLASS);
    }

    root.registerModule({
        id: 'panelCalls',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);