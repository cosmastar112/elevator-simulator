;(function(root) {

    let _obj;

    const CLASS_NAME_CONTAINER = 'control_panel_buttons';
    const CLASS_NAME_BTN_DEFAULT = 'control_panel_button';

    function init()
    {
        _obj = {
            _name: 'Кнопочная панель',
            _btns: null,
            _view: null,
            getView: function() {
                return this._view;
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        //инициализация хранилища объектов кнопок
        newObj._btns = [];
        newObj._view = _createView(_obj, params);

        return newObj;
    }

    function _createView(self, params)
    {
        let view = document.createElement('div');
        view.classList.add(CLASS_NAME_CONTAINER);
        //название панели
        let panelTitle = document.createElement('h3');
        panelTitle.innerHTML = self._name;
        view.appendChild(panelTitle);
        // let totalFloors = document.createElement('p');
        // totalFloors.innerHTML = 'Всего этажей: ' + params.total_floors;
        // view.appendChild(totalFloors);
        //кнопки
        let btnsContainer = _createBtns(params.total_floors);
        view.appendChild(btnsContainer);

        return view;
    }

    function _createBtns(total_floors)
    {
        let view = document.createElement('div');
        for (let floorNumber = 1; floorNumber <= total_floors; floorNumber++) {
            let btn = _createBtn(floorNumber);
            view.appendChild(btn);
            //пять кнопок в ряд
            if (floorNumber % 5 === 0) {
                view.appendChild(document.createElement('br'));
            }
        }

        return view;
    }

    function _createBtn(floorNumber)
    {
        let btn = document.createElement('button');
        btn.type = 'submit';
        btn.formAction = '#';
        btn.value = floorNumber;
        btn.innerHTML = floorNumber;
        btn.classList.add(CLASS_NAME_BTN_DEFAULT);

        return btn;
    }

    root.registerModule({
        id: 'panelButtons',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);