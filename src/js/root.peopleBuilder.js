;(function(root) {

    let _obj;

    const CLASS_NAME_DEFAULT = 'people-default';

    function init()
    {
        _obj = {
            _persons: null,
            _loadingFloor: null,
            _total: null,
            _view: null,
            getLoadingFloor: function() {
                return this._loadingFloor;
            },
            getView: function() {
                return this._view;
            },
            updateView: function() {
                this._view = _createView(this);
                return this._view;
            },
            getPersons: function() {
                return this._persons;
            }
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);

        //этаж погрузки
        newObj._loadingFloor = params.floor;
        //количество человек в группе
        let totalPersons = 3;
        newObj._total = totalPersons;
        newObj._persons = _createPersons({floor: params.floor, total: newObj._total}, newObj);
        newObj._view = _createView(newObj);

        return newObj;
    }

    function _createPersons(params, self)
    {
        let personBuilder = root.getPersonBuilder();

        let persons = [];
        for(let personNumber = 0; personNumber < params.total; personNumber++) {
            let person = personBuilder.construct({loadingFloor: params.floor});
            persons.push(person);
        }

        return persons;
    }

    function _createView(self)
    {
        let peopleView = document.createElement('div');
        peopleView.classList.add(CLASS_NAME_DEFAULT);
        self._persons.forEach(function(person) {
            let personView = person.getView();
            peopleView.appendChild(personView);
        });

        return peopleView;
    }

    root.registerModule({
        id: 'peopleBuilder',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);