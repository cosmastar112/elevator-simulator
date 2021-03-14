window.ElevatorSimulator2021 = (function() {

    function init()
    {
        _initModules();
    }

    function registerModule(publicPart)
    {
        _modules.push(publicPart);
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

    let public = {
        init: init,
        registerModule: registerModule,
    };

    return public;
})();

window.addEventListener('load', (event) => {
    window.ElevatorSimulator2021.init()
});