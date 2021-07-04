;(function(root) {

    let _obj;

    const DIRECTION_UP = 'Вверх';
    const DIRECTION_DOWN = 'Вниз';

    const DIRECTION_CODE_UP = 1;
    const DIRECTION_CODE_DOWN = -1;

    const CLASS_NAME_DEFAULT = 'callPanel_btn';
    const CLASS_NAME_UP = 'callPanel_btn-up';
    const CLASS_NAME_DOWN = 'callPanel_btn-down';
    const CLASS_NAME_PRESSED = 'callPanel_btn-pressed';

    const CALLTYPE_FLOOR = 'floor';

    function init()
    {
        _obj = {
            _number: null,
            _view: null,
            _basename: 'Панель вызова №',
            _clickHandler: null,
            _isBtnUpPressed: false,
            _isBtnDownPressed: false,
            _btnUp: null,
            _btnDown: null,
            getNumber: function() {
                return this._number;
            },
            getView: function() {
                return this._view;
            },
            unpressBtns: _unpressBtns
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        newObj._number = params.number;
        //идентификация панели (присвоение номера этажа)
        newObj._basename += params.number;
        // создать представление
        newObj._view = _createView(params, newObj);

        newObj._clickHandler = _createClickHandler(newObj);
        newObj._view.addEventListener('click', newObj._clickHandler);

        return newObj;
    }

    function _createView(params, self)
    {
        let view = document.createElement('div');

        let number = params.number;
        // добавить кнопку "Вверх" если это не последний этаж
        if (number !== params.totalFloors) {
            let btnUp = _createBtn({number: number, direction: DIRECTION_UP, cssClassName: CLASS_NAME_UP});
            view.appendChild(btnUp);
            self._btnUp = btnUp;
        }
        // добавить кнопку "Вниз" если это не первый этаж
        if (number !== 1) {
            let btnDown = _createBtn({number: number, direction: DIRECTION_DOWN, cssClassName: CLASS_NAME_DOWN});
            view.appendChild(btnDown);
            self._btnDown = btnDown;
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
        btn.classList.add(params.cssClassName, CLASS_NAME_DEFAULT);

        return btn;
    }

    function _createClickHandler(self)
    {
        let cb = function(event)
        {
            if (event.target.nodeName === "BUTTON") {
                console.log('Была нажата кнопка вызова лифта с этажа');
                //проверить нажата ли уже кнопка
                let direction = event.target.classList.contains(CLASS_NAME_UP) ? CLASS_NAME_UP : CLASS_NAME_DOWN;
                if (_isBtnPressed(direction, self)) {
                    console.log('Кнопка уже нажата');
                    //кнопка нажата, не создавать новый вызов
                    return;
                }

                //проверить: создан ли уже вызов с этажа (неважно в каком направлении)
                let btnUpPressed = _isBtnPressed(CLASS_NAME_UP, self);
                let btnDownPressed = _isBtnPressed(CLASS_NAME_DOWN, self);
                let callFromFloorAlreadyExist = btnUpPressed || btnDownPressed;
                if (callFromFloorAlreadyExist) {
                    //и если да, то заблокировать кнопку до момента, пока вызов не будет обработан
                    _pressBtn(direction, self);
                    return;
                }

                console.log('Создать новый вызов');
                //кнопка не нажата, создать новый вызов
                //этаж вызова
                let floor = event.target.value;
                //код направления
                let directionCode = (direction === CLASS_NAME_UP) ? DIRECTION_CODE_UP : DIRECTION_CODE_DOWN;
                //вызов
                let call = root.getCallBuilder().construct({type: CALLTYPE_FLOOR, floor: floor, direction: directionCode});
                //событие создания вызова
                let elevatorCallCreatedEvent = _createCallEvent(call);
                //оповестить подписчиков о создании вызова
                document.dispatchEvent(elevatorCallCreatedEvent);
                //заблокировать кнопку до момента, пока вызов не будет обработан
                _pressBtn(direction, self);
                // console.log('вызов', self);
            }
        };

        return cb;
    }

    function _isBtnPressed(direction, panel)
    {
        if (direction === CLASS_NAME_UP) {
            return panel._isBtnUpPressed;
        } else if (direction === CLASS_NAME_DOWN) {
            return panel._isBtnDownPressed;
        }
    }

    function _pressBtn(direction, panel)
    {
        if (direction === CLASS_NAME_UP) {
            panel._isBtnUpPressed = true;
            panel._btnUp.classList.add(CLASS_NAME_PRESSED);
        } else if (direction === CLASS_NAME_DOWN) {
            panel._isBtnDownPressed = true;
            panel._btnDown.classList.add(CLASS_NAME_PRESSED);
        }
    }

    function _createCallEvent(call)
    {
        return new CustomEvent('elevatorCallFromFloorCreated', {
            detail: { 
                call: call 
            }
        });
    }

    //отжать кнопки вызова
    function _unpressBtns()
    {
        if (this._btnUp) {
            _unpressBtn(CLASS_NAME_UP, this);
        }
        if (this._btnDown) {
            _unpressBtn(CLASS_NAME_DOWN, this);
        }
    }

    function _unpressBtn(direction, panel)
    {
        if (direction === CLASS_NAME_UP) {
            panel._isBtnUpPressed = false;
            panel._btnUp.classList.remove(CLASS_NAME_PRESSED);
        } else if (direction === CLASS_NAME_DOWN) {
            panel._isBtnDownPressed = false;
            panel._btnDown.classList.remove(CLASS_NAME_PRESSED);
        }
    }
    root.registerModule({
        id: 'callPanelBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);