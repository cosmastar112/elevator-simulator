;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_total-persons-num';
    const CLASS_TOTAL_CONTAINER = 'panel_total-persons-num_total';
    const PANEL_TITLE_CLASS = 'panel__title';

    function init()
    {
        _obj = {
            _name: 'Количество пассажиров',
            _total: 0,
            _view: null,
            getTotal: function() {
                return this._total;
            },
            getView: function() {
                return this._view;
            },
            setTotal: function(newTotal) {
                this._total = newTotal;
            },
            updateView: function() {
               this._view = _createView(this);
               return this._view;
            }
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        newObj._view = _createView(_obj);

        return newObj;
    }

    function _createView(self)
    {
        let view = document.createElement('div');
        view.classList.add(CLASS_NAME);
        //название панели
        let panelTitle = document.createElement('div');
        panelTitle.innerHTML = self._name;
        panelTitle.classList.add(PANEL_TITLE_CLASS);
        view.appendChild(panelTitle);
        //количество пассажиров
        let panelIndicator = _createViewPanelIndicator.call(self);
        view.appendChild(panelIndicator);

        return view;
    }

    function _createViewPanelIndicator()
    {
        let panelIndicator = document.createElement('span');
        panelIndicator.classList.add(CLASS_TOTAL_CONTAINER);
        panelIndicator.innerHTML = this.getTotal();

        return panelIndicator;
    }

    root.registerModule({
        id: 'panelPersonsTotalNumBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);