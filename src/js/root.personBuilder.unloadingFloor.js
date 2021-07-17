;(function(root) {

    let algorytmTemplate;
    let algorytmIfMoveDirectionIsUp;
    let algorytmIfMoveDirectionIsDown;

    function init()
    {
        algorytmTemplate = {
            _minFloor: 1,
            _maxFloor: null,
            _currentFloor: null,
            setMinFloor: function(value) {
                this._minFloor = value;
            },
            setMaxFloor: function(value) {
                this._maxFloor = value;
            },
            getMinFloor: function() {
                return this._minFloor;
            },
            getMaxFloor: function() {
                return this._maxFloor;
            },
            setCurrentFloor: function(value) {
                this._currentFloor = value;
            },
            getCurrentFloor: function() {
                return this._currentFloor;
            },
            getInt: function() {},
            emergencyGetInt: function() {}
        };

        algorytmIfMoveDirectionIsUp = Object.assign({}, algorytmTemplate);
        algorytmIfMoveDirectionIsUp.getInt = function() {
            //аварийный алгоритм на определенных входных данных
            if (this.getCurrentFloor() === this.getMaxFloor()) {
                // console.log('Входные данные не могут быть обработаны основным алгоритмом, используется аварийный алгоритм');
                return this.emergencyGetInt();
            }

            let chance = root.getUtils().getRandomIntInclusive(1, 10);
            // console.log('Вероятность = ', chance/10);

            let floor = null;
            //с вероятностью 80% нажмут один из расположенных выше этажей
            if (chance <= 8) {
                floor = root.getUtils().getRandomIntInclusive(this.getCurrentFloor() + 1, this.getMaxFloor());
            //20% вероятности нажатия на один из этажей ниже по следованию
            } else if (chance > 8) {
                floor = root.getUtils().getRandomIntInclusive(this.getCurrentFloor(), this.getMinFloor());
            }

            return floor;
        };
        algorytmIfMoveDirectionIsUp.emergencyGetInt = function() {
            return root.getUtils().getRandomIntInclusive(this.getMinFloor(), this.getCurrentFloor() - 1);
        };

        algorytmIfMoveDirectionIsDown = Object.assign({}, algorytmTemplate);
        algorytmIfMoveDirectionIsDown.getInt = function() {
           //аварийный алгоритм на определенных входных данных
            if (this.getCurrentFloor() === this.getMinFloor()) {
                // console.log('Входные данные не могут быть обработаны основным алгоритмом, используется аварийный алгоритм');
                return this.emergencyGetInt();
            }

            let chance = root.getUtils().getRandomIntInclusive(1, 10);
            // console.log('Вероятность = ', chance/10);

            let floor = null;
            //с вероятностью 90% нажмут на 1 этаж
            if (chance <= 9) {
                floor = 1;
            //10% вероятности нажатия на один из этажей ниже по следованию
            } else if (chance > 9) {
                floor = root.getUtils().getRandomIntInclusive(this.getCurrentFloor() - 1, this.getMinFloor());
            }

            return floor;
        };
        algorytmIfMoveDirectionIsDown.emergencyGetInt = function() {
            return root.getUtils().getRandomIntInclusive(this.getCurrentFloor() + 1, this.getMaxFloor());
        };
    }

    function construct(params)
    {

        //текущий этаж
        let currentFloor = params.currentFloor;
        //направление движения
        let moveDirection = params.moveDirection;
        let minFloor = params.minFloor;
        let maxFloor = params.maxFloor;

        // console.log('Текущий этаж: ' + currentFloor);
        // console.log('Направление движения: ' + moveDirection);

        let algorytm = defineAlgorytm(moveDirection);
        if (algorytm) {
            algorytm.setMinFloor(minFloor);
            algorytm.setMaxFloor(maxFloor);
            algorytm.setCurrentFloor(currentFloor);
            let targetFloor = algorytm.getInt();
            // console.log('Выбран этаж: ' + targetFloor);

            return targetFloor;
        }
        // console.log('Критическая ошибка: алгоритм неопределен');

        return null;
    }

    function defineAlgorytm(moveDirection)
    {
        let algorytm = null;
        // console.log('Какой алгоритм выбора этажа назначения следует использовать?');
        if (moveDirection === 1) {
            // console.log('Алгоритм 1, т.к. последнее направление движения -- наверх');
            algorytm = algorytmIfMoveDirectionIsUp;
        } else if (moveDirection === -1) {
            // console.log('Алгоритм 2, т.к. последнее направление движения -- вниз');
            algorytm = algorytmIfMoveDirectionIsDown;
        }

        return algorytm;
    }

    root.registerModule({
        id: 'personBuilder_unloadingFloor',
        init: init,
        construct: construct,
    });

})(window.ElevatorSimulator2021);