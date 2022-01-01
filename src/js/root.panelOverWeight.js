;(function(root) {

    let _obj;

    const CLASS_NAME = 'panel_overweight';
    const CLASS_NAME_INDICATOR = 'panel_overweight_indicator';
    const CLASS_NAME_INDICATOR_OVERWEIGHTED = 'panel_overweight_indicator-overweighted';
    const PANEL_TITLE_CLASS = 'panel__title';

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
            },
            updateView_overweight: _updateView_overweight,
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
        let panelIndicator = document.createElement('span');
        panelIndicator.classList.add(CLASS_NAME_INDICATOR);
        panelIndicator.innerHTML = self.getIndicatorValue();
        view.appendChild(panelIndicator);

        return view;
    }

    function _updateView_overweight(isOverweighted)
    {
        let spansCollection = document.getElementsByClassName(CLASS_NAME_INDICATOR);
        if (spansCollection.length > 0) {
            let span = spansCollection.item(0);
            //обновление значения
            span.innerHTML = isOverweighted;

            if (isOverweighted) {
                span.classList.add(CLASS_NAME_INDICATOR_OVERWEIGHTED);
            } else {
                span.classList.remove(CLASS_NAME_INDICATOR_OVERWEIGHTED);
            }
        }
    }

    root.registerModule({
        id: 'panelOverWeight',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);