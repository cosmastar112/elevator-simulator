;(function(root) {

    let _elevator;

    function init()
    {
        _elevator = {
            _number: null,
            _view: null,
            _controlPanel: null,
            getNumber: function() {
                return this._number;
            },
            getControlPanel: function() {
                return this._controlPanel;
            },
            getView: function() {
                return this._view;
            }
        };
    }

    function construct(params)
    {
        let elevator = Object.assign({}, _elevator);
        elevator._number = params.number;
        // панель управления
        elevator._controlPanel = _createControlPanel(params);
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

    function _createControlPanel(params)
    {
        let controlPanelBuilder = root.getControlPanelBuilder();
        let controlPanel = controlPanelBuilder.construct(params);

        return controlPanel;
    }

    root.registerModule({
        id: 'elevatorBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);