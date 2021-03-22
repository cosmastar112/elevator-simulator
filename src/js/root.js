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

    // система запущена и готова к работе
    function onStartSystemEnd()
    {
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
        onStartSystemEnd: onStartSystemEnd,
    };

    return public;
})();

window.addEventListener('load', (event) => {
    window.ElevatorSimulator2021.init()
});