;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _number: null,
            _view: null,
            _basename: 'Панель управления №',
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

        return newObj;
    }

    function _createView(params)
    {
        let view = document.createElement('div');
        view.innerHTML = _obj._basename + params.number;

        return view;
    }

    root.registerModule({
        id: 'controlPanelBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);