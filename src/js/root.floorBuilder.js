;(function(root) {

    let _floor;

    function init()
    {
        _floor = {
            _number: null,
            _callPanel: null,
            _view: null,
            getNumber: function() {
                return this._number;
            },
            getCallPanel: function() {
                return this._callPanel;
            },
            getView: function() {
                return this._view;
            }
        };
    }

    function constructFloor(floorParams)
    {
        // console.log('Создание этажа...');
        // console.log(floorParams);

        let floor = Object.assign({}, _floor);
        floor._number = floorParams.number;
        floor._callPanel = _createCallPanel(floorParams.number);
        // создать представление
        floor._view = _createView(floorParams.number);

        return floor;
    }

    function _createView(floorNumber)
    {
        let view = document.createElement('div');
        view.innerHTML = floorNumber;

        return view;
    }


    function _createCallPanel(number)
    {
        let callPanelBuilder = root.getCallPanelBuilder();
        let callPanel = callPanelBuilder.construct({ number: number });

        return callPanel;
    }

    root.registerModule({
        id: 'floorBuilder',
        init: init,
        constructFloor: constructFloor,
    });

})(window.ElevatorSimulator2021);