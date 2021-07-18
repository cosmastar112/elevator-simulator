window.ElevatorSimulator2021 = (function() {

    function init()
    {
        _initModules();
    }

    function registerModule(publicPart)
    {
        _modules.push(publicPart);
    }

    function getBuilder()
    {
        let module = _getModuleById('builder');

        return module;
    }

    function getBuildingRender()
    {
        let module = _getModuleById('builder.render');

        return module;
    }

    function getFloorBuilder()
    {
        let module = _getModuleById('floorBuilder');

        return module;
    }

    function getElevatorBuilder()
    {
        let module = _getModuleById('elevatorBuilder');

        return module;
    }

    function getControlPanelBuilder()
    {
        let module = _getModuleById('controlPanelBuilder');

        return module;
    }

    function getCallPanelBuilder()
    {
        let module = _getModuleById('callPanelBuilder');

        return module;
    }

    function getRouterBuilder()
    {
        let module = _getModuleById('routerBuilder');

        return module;
    }

    function getCallQueueBuilder()
    {
        let module = _getModuleById('callQueueBuilder');

        return module;
    }

    function getPeopleBuilder()
    {
        let module = _getModuleById('peopleBuilder');

        return module;
    }

    function getPersonBuilder()
    {
        let module = _getModuleById('personBuilder');

        return module;
    }

    function getPanelPersonsTotalNumBuilder()
    {
        let module = _getModuleById('panelPersonsTotalNumBuilder');

        return module;
    }

    function getPanelPersonsTotalWeight()
    {
        let module = _getModuleById('panelPersonsTotalWeight');

        return module;
    }

    function getPanelOverWeight()
    {
        let module = _getModuleById('panelOverWeight');

        return module;
    }

    function getPanelButtons()
    {
        let module = _getModuleById('panelButtons');

        return module;
    }

    function getPanelPassengers()
    {
        let module = _getModuleById('panelPassengers');

        return module;
    }

    function getPanelCalls()
    {
        let module = _getModuleById('panelCalls');

        return module;
    }

    function getCallBuilder()
    {
        let module = _getModuleById('callBuilder');

        return module;
    }

    function getRouteBuilder()
    {
        let module = _getModuleById('routeBuilder');

        return module;
    }

    function getPersonUnloadingFloorBuilder()
    {
        let module = _getModuleById('personBuilder_unloadingFloor');

        return module;
    }

    function getLoadingAndUnloadingManager()
    {
        let module = _getModuleById('loadingAndUnloadingManager');

        return module;
    }

    function getUtils()
    {
        let module = _getModuleById('utils');

        return module;
    }

    //система запущена и готова к работе
    function onBuildEnd()
    {
        //запустить лифты
        this.getBuilder().getBuilding().getElevators().forEach(function(elevator) {
            elevator._setState(1);
        });
        console.log('Система запущена!');
    }

    let _modules = [];

    function _initModules()
    {
        for (let i = 0, l = _modules.length; i < l; i++) {
            let module = _modules[i];
            console.log('start init module[' + i + ']: ' + module.id);
            module.init();
            console.log('end init module[' + i + ']: ' + module.id);
        }

        _afterInit();
    }

    function _afterInit()
    {
        //триггер клика по кнопке «Запуск!» для облегчения тестирования
        document.getElementById('system_params_form__submit_btn').dispatchEvent(new Event('click'));
    }

    function _getModuleById(id)
    {
        return _modules.find(function(el) {
            return el.id === id;
        });
    }

    let public = {
        init: init,
        registerModule: registerModule,
        getBuilder: getBuilder,
        getBuildingRender: getBuildingRender,
        getFloorBuilder: getFloorBuilder,
        getElevatorBuilder: getElevatorBuilder,
        getControlPanelBuilder: getControlPanelBuilder,
        getCallPanelBuilder: getCallPanelBuilder,
        getRouterBuilder: getRouterBuilder,
        getCallQueueBuilder: getCallQueueBuilder,
        getPeopleBuilder: getPeopleBuilder,
        getPersonBuilder: getPersonBuilder,
        getPanelPersonsTotalNumBuilder: getPanelPersonsTotalNumBuilder,
        getPanelPersonsTotalWeight: getPanelPersonsTotalWeight,
        getPanelOverWeight: getPanelOverWeight,
        getPanelButtons: getPanelButtons,
        getPanelPassengers: getPanelPassengers,
        getPanelCalls: getPanelCalls,
        getCallBuilder: getCallBuilder,
        getRouteBuilder: getRouteBuilder,
        getPersonUnloadingFloorBuilder: getPersonUnloadingFloorBuilder,
        getLoadingAndUnloadingManager: getLoadingAndUnloadingManager,
        getUtils: getUtils,
        onBuildEnd: onBuildEnd,
    };

    return public;
})();

window.addEventListener('load', (event) => {
    window.ElevatorSimulator2021.init()
});