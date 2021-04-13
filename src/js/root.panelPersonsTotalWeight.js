;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_total-persons-weight';

    function init()
    {
        _obj = {
            _name: 'Общий вес пассажиров',
            _total: 0,
            _view: null,
            getTotal: function() {
                return this._total;
            },
            getView: function() {
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
        let panelTitle = document.createElement('h3');
        panelTitle.innerHTML = self._name;
        view.appendChild(panelTitle);
        //количество пассажиров
        let panelIndicator = document.createElement('span');
        panelIndicator.innerHTML = self.getTotal();
        view.appendChild(panelIndicator);

        return view;
    }

    root.registerModule({
        id: 'panelPersonsTotalWeight',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);