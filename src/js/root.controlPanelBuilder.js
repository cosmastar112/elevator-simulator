;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _number: null,
            _view: null,
            _basename: 'Панель управления №',
            _panelPersonsTotalNum: null,
            _panelPersonsTotalWeight: null,
            _panelOverweight: null,
            _panelPassengers: null,
            _panelButtons: null,
            getNumber: function() {
                return this._number;
            },
            getView: function() {
                return this._view;
            },
            getPanelPassengers: function() {
                return this._panelPassengers;
            },
            getPanelPersonsTotalNum: function() {
                return this._panelPersonsTotalNum;
            },
            getPanelPersonsTotalWeight: function() {
                return this._panelPersonsTotalWeight;
            },
            getPanelOverweight: function() {
                return this._panelOverweight;
            },
            getPanelButtons: function() {
                return this._panelButtons;
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);
        newObj._number = params.number;
        newObj._panelButtons = _createPanelButtons({total_floors: params.total_floors});
        newObj._panelPersonsTotalNum = _createPanelPersonsTotalNum();
        newObj._panelPersonsTotalWeight = _createPanelPersonsTotalWeight();
        newObj._panelOverweight = _createPanelOverweight();
        newObj._panelPassengers = _createPanelPassengers();
        // создать представление
        newObj._view = _createView(params, newObj);

        return newObj;
    }

    function _createView(params, self)
    {
        let view = document.createElement('div');
        //id панели управления (связь с id лифта)
        view.id = 'control_panel-' + self._number;
        //название панели
        let panelTitle = document.createElement('h2');
        panelTitle.innerHTML = _obj._basename + params.number;
        view.appendChild(panelTitle);
        //индикатор количества пассажиров
        let panelPersonsTotalNumView = self._panelPersonsTotalNum.getView();
        view.appendChild(panelPersonsTotalNumView);
        //индикатор общего веса пассажиров
        let panelPersonsTotalWeightView = self._panelPersonsTotalWeight.getView();
        view.appendChild(panelPersonsTotalWeightView);
        //индикатор перегруза
        let panelOverweight = self._panelOverweight.getView();
        view.appendChild(panelOverweight);
        //кнопочная панель
        let panelButtons = self._panelButtons.getView();
        view.appendChild(panelButtons);
        //панель "пасажиры"
        let panelPassengers = self._panelPassengers.getView();
        view.appendChild(panelPassengers);

        return view;
    }

    function _createPanelPersonsTotalNum()
    {
        let panelBuilder = root.getPanelPersonsTotalNumBuilder();
        let controlPanel = panelBuilder.construct();

        return controlPanel;
    }

    function _createPanelPersonsTotalWeight()
    {
        let panelBuilder = root.getPanelPersonsTotalWeight();
        let controlPanel = panelBuilder.construct();

        return controlPanel;
    }

    function _createPanelOverweight()
    {
        let panelBuilder = root.getPanelOverWeight();
        let controlPanel = panelBuilder.construct();

        return controlPanel;
    }

    function _createPanelButtons(params)
    {
        let panelBuilder = root.getPanelButtons();
        let panel = panelBuilder.construct({total_floors: params.total_floors});

        return panel;
    }

    function _createPanelPassengers()
    {
        let panelBuilder = root.getPanelPassengers();
        let controlPanel = panelBuilder.construct();

        return controlPanel;
    }

    root.registerModule({
        id: 'controlPanelBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);