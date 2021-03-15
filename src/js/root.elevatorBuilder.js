;(function(root) {

    let _elevator;

    function init()
    {
        _elevator = {
            _number: null,
            _view: null,
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
        // console.log('Создание этажа...');
        // console.log(params);

        let elevator = Object.assign({}, _elevator);
        elevator._number = params.number;
        // создать представление
        elevator._view = _createView(params.number);

        return elevator;
    }

    function _createView(number)
    {
        let view = document.createElement('div');
        view.innerHTML = number;

        return view;
    }

    root.registerModule({
        id: 'elevatorBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);