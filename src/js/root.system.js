;(function(root) {

    function init()
    {
        let btn = document.getElementById('system_params_form__submit_btn');
        if (!btn) {
            return;
        }
        btn.addEventListener('click', _startHandler);
    }

    function _start(systemParams)
    {
        // инициализировать систему
        // console.log(systemParams);
        let builder = root.getBuilder();
        let building = builder.constructBuilding(systemParams);
        // console.log(building);

        // отрисовать здание
        _render(building);

        root.onStartSystemEnd();
    }

    function _render(building)
    {
        let buildingView = building.getView();
        let buildingContainerId = 'buildingContainer';
        let buildingContainer = document.getElementById(buildingContainerId);
        if (!buildingContainer) {
            return;
        }
        buildingContainer.appendChild(buildingView);
    }

    function _startHandler(event)
    {
        event.preventDefault();
        // отключить кнопку
        event.target.disabled = true;
        // сериализовать форму
        let serializedForm = _serializeForm();
        _start(serializedForm);
    }

    function _serializeForm()
    {
        let form = document.getElementById('system_params_form');
        if (!form) {
            return null;
        }

        let total_floors = _getSelectedOptionValue(form.elements, 0);
        let total_elevators = _getSelectedOptionValue(form.elements, 1);
        let lifting_power = _getSelectedOptionValue(form.elements, 2);

        return {
            'total_floors': parseInt(total_floors, 10),
            'total_elevators': parseInt(total_elevators, 10),
            'lifting_power': parseInt(lifting_power, 10),
        };
    }

    function _getSelectedOptionValue(selectedElements, index)
    {
        let select = selectedElements[index];
        return select.options[select.selectedIndex].value;
    }

    root.registerModule({
        id: 'system',
        init: init,
    });

})(window.ElevatorSimulator2021);