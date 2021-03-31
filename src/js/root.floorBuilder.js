;(function(root) {

    let _floor;

    function init()
    {
        _floor = {
            _number: null,
            _callPanel: null,
            _view: null,
            _callFromFloorRegisteredHandler: null,
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
        floor._callPanel = _createCallPanel(floorParams);
        // создать представление
        floor._view = _createView(floorParams.number);

        //вызов с этажа поступил в очередь вызова, на этаже необходимо создать группу людей
        floor._callFromFloorRegisteredHandler = _createCallFromFloorRegisteredHandler(floor);
        document.addEventListener('callFromFloorRegistered', floor._callFromFloorRegisteredHandler);

        return floor;
    }

    function _createCallFromFloorRegisteredHandler(self)
    {
        let cb = function(event) {
            let floor = event.detail.call.floor;
            // console.log(self.getNumber(), floor);
            if (self.getNumber() === parseInt(floor)) {
                console.log('Создать на этаже ' + floor + ' группу людей');
            }
        }

        return cb;
    }

    function _createView(floorNumber)
    {
        let view = document.createElement('div');
        view.innerHTML = floorNumber;

        return view;
    }


    function _createCallPanel(params)
    {
        let callPanelBuilder = root.getCallPanelBuilder();
        let callPanel = callPanelBuilder.construct(params);

        return callPanel;
    }

    root.registerModule({
        id: 'floorBuilder',
        init: init,
        constructFloor: constructFloor,
    });

})(window.ElevatorSimulator2021);