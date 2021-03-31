;(function(root) {

    let _obj;

    const DIRECTION_UP = 'Вверх';
    const DIRECTION_DOWN = 'Вниз';

    const DIRECTION_CODE_UP = 1;
    const DIRECTION_CODE_DOWN = -1;

    const CLASS_NAME_UP = 'callPanel_up';
    const CLASS_NAME_DOWN = 'callPanel_down';

    function init()
    {
        _obj = {
            _number: null,
            _view: null,
            _basename: 'Панель вызова №',
            _handlerUp: null,
            _handlerDown: null,
            getNumber: function() {
                return this._number;
            },
            getView: function() {
                return this._view;
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        newObj._number = params.number;
        // создать представление
        newObj._view = _createView(params);

        newObj._view.addEventListener('click', _clickHandler);

        return newObj;
    }

    function _createView(params)
    {
        let view = document.createElement('div');

        let number = params.number;
        // добавить кнопку "Вверх" если это не последний этаж
        if (number !== params.totalFloors) {
            let btnUp = _createBtn({number: number, direction: DIRECTION_UP, className: CLASS_NAME_UP});
            view.appendChild(btnUp);
        }
        // добавить кнопку "Вниз" если это не первый этаж
        if (number !== 1) {
            let btnDown = _createBtn({number: number, direction: DIRECTION_DOWN, className: CLASS_NAME_DOWN});
            view.appendChild(btnDown);
        }

        return view;
    }

    function _createBtn(params)
    {
        let btn = document.createElement('button');
        btn.type = 'submit';
        btn.formAction = '#';
        btn.value = params.number;
        btn.innerHTML = params.direction;
        btn.className  = params.className;

        return btn;
    }

    function _clickHandler(event)
    {
        if (event.target.nodeName === "BUTTON") {
            //вызов
            let call = null;
            if (event.target.className === CLASS_NAME_UP) {
                let text = 'Этаж вызова: ' + event.target.value + '. Направление: ' + DIRECTION_UP;
                alert(text);
                //создание вызова
                call = {floor: event.target.value, direction: DIRECTION_CODE_UP};
            } else if (event.target.className === CLASS_NAME_DOWN) {
                let text = 'Этаж вызова: ' + event.target.value + '. Направление: ' + DIRECTION_DOWN;
                alert(text);
                //создание вызова
                call = {floor: event.target.value, direction: DIRECTION_CODE_DOWN};
            }
            //событие
            let elevatorCallCreatedEvent = _createCallEvent(call);
            //уведомление о вызове
            document.dispatchEvent(elevatorCallCreatedEvent);
        }
    }

    function _createCallEvent(call)
    {
        return new CustomEvent('elevatorCallCreated', {
            detail: { 
                call: call 
            }
        });
    }

    root.registerModule({
        id: 'callPanelBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);