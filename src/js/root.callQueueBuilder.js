;(function(root) {

    let _obj;

    function init()
    {
        _obj = {
            _queue: [],
            _handler: null,
        };
    }

    function construct()
    {
        let newObj = Object.assign({}, _obj);
        //регистрация обработчика вызова
        newObj._handler = _createHandler();
        document.addEventListener('elevatorCallCreated', newObj._handler);

        return newObj;
    }

    function _createHandler()
    {
        let cb = function(event) {
            let floor = event.detail.call.floor;
            let direction = event.detail.call.direction;

            let text = 'В очередь попал вызов: ';
            text += 'этаж ' + floor + '; ';
            text += 'направление ' + direction;
            alert(text);
            // console.log('поступил вызов лифта');
        }

        return cb;
    }

    root.registerModule({
        id: 'callQueueBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);