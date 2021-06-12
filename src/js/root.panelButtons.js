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
            _clickHandler: null,
            getView: function() {
                return this._view;
            },
            handlePassengersInput: _handlePassengersInput
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        //инициализация хранилища объектов кнопок
        newObj._btns = [];
        newObj._view = _createView(newObj, params);

        newObj._clickHandler = _createClickHandler(newObj);
        newObj._view.addEventListener('click', newObj._clickHandler);

        return newObj;
    }

    function _createClickHandler(self)
    {
        let cb = function(event)
        {
            if (event.target.nodeName === "BUTTON") {
                console.log('Была нажата кнопка вызова лифта в кабине. Этаж: ', event.target.value);
            }
        };

        return cb;
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
        let btnsContainer = _createBtns(self, params.total_floors);
        view.appendChild(btnsContainer);

        return view;
    }

    function _createBtns(self, total_floors)
    {
        let view = document.createElement('div');
        for (let floorNumber = 1; floorNumber <= total_floors; floorNumber++) {
            let btn = _createBtn(floorNumber);

            //сохранить ссылку на кнопку
            self._btns.push(btn);

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

    function _handlePassengersInput(input)
    {
        let self = this;
        // console.log(this, input);
        let uniqueInput = root.getUtils().arrayUnique(input);
        // console.log(uniqueInput);
        uniqueInput.forEach(function(nextInput) {
            //найти соответствующую кнопку этажа
            let btn = _findBtn.call(self, nextInput);
            // console.log(btn);
            if (btn) {
                //триггер кнопки вызова в кабине
                btn.dispatchEvent(new Event('click', {'bubbles': true}));
            }
        });
    }

    //найти соответствующую кнопку этажа
    function _findBtn(value)
    {
        let btn = this._btns.find(function(panelBtn) {
            return parseInt(panelBtn.value) === value;
        });

        return btn;
    }

    root.registerModule({
        id: 'panelButtons',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);