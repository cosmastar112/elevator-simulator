;(function(root) {

    function init()
    {
        let btn = document.getElementById('system_params_form__submit_btn');
        if (!btn) {
            return;
        }
        btn.addEventListener('click', _startHandler);
    }

    function _startHandler(event)
    {
        event.preventDefault();
        // отключить кнопку
        event.target.disabled = true;
        // сериализовать форму
        let serializedForm = _serializeForm();
        console.log(serializedForm);

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
            'total_floors': total_floors,
            'total_elevators': total_elevators,
            'lifting_power': lifting_power,
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