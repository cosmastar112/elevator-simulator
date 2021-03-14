;(function(root) {

    function init()
    {
        console.log('init system');
    }

    root.registerModule({
        id: 'system',
        init: init,
    });

})(window.ElevatorSimulator2021);