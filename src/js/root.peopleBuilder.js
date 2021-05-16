;(function(root) {

    let _obj;

    const CLASS_NAME_DEFAULT = 'people-default';

    const MIN_TOTAL = 1;
    const MAX_TOTAL = 5;

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
            //группа пуста
            isEmpty: function() {
                return this._total === 0;
            },
            //извлечь из группы человека
            detachPerson: function() {
                if (this._persons && this._persons.length > 0) {
                    this.decrementTotal();
                    return this._persons.shift();
                }
                return undefined;
            },
            //уменьшить на один количество людей в группе
            decrementTotal: function() {
                this._total--;
            },
        };
    }

    function construct(params)
    {
        let newObj = Object.assign({}, _obj);

        //этаж погрузки
        newObj._loadingFloor = params.floor;
        //количество человек в группе
        let totalPersons = root.getUtils().getRandomIntInclusive(MIN_TOTAL, MAX_TOTAL);;
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