;(function(root) {

    function init()
    {
    }

    function createView(building)
    {
        let floors = building.getFloors();

        let buildingView = document.createElement('div');

        let table = document.createElement('table');
        let tr1 = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = "Этаж";
        tr1.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = "Кнопки вызова";
        tr1.appendChild(th2);
        let th3 = document.createElement('th');
        th3.innerHTML = "Местоположение лифта";
        tr1.appendChild(th3);
        table.appendChild(tr1);

        for (let floorNumber = floors.length - 1; floorNumber >= 0; floorNumber--) {
            let tr = _createTr(floors, floorNumber);
            table.appendChild(tr);
        }

        buildingView.appendChild(table);

        return buildingView;
    }

    function _createTr(floors, floorNumber)
    {
        let tr2 = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = floors[floorNumber].getNumber();
        tr2.appendChild(td1);
        let td2 = document.createElement('td');
        td2.innerHTML = "_Вверх_ _Вниз_";
        tr2.appendChild(td2);
        let td3 = document.createElement('td');
        td3.innerHTML = "";
        tr2.appendChild(td3);

        return tr2;
    }

    root.registerModule({
        id: 'builder.render',
        init: init,
        createView: createView,
    });

})(window.ElevatorSimulator2021);