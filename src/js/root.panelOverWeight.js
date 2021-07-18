;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_overweight';
    const CLASS_NAME_INDICATOR = 'panel_overweight_indicator';
    const CLASS_NAME_INDICATOR_OVERWEIGHTED = 'panel_overweight_indicator-overweighted';

    function init()
    {
        _obj = {
            _name: 'Индикатор перегруза',
            _value: false,
            _view: null,
            getIndicatorValue: function() {
                return this._value;
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
        panelIndicator.classList.add(CLASS_NAME_INDICATOR);
        panelIndicator.innerHTML = self.getIndicatorValue();
        view.appendChild(panelIndicator);

        return view;
    }

    root.registerModule({
        id: 'panelOverWeight',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);