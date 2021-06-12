;(function(root) {

    function init()
    {
    }

    //@see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
    function getRandomIntInclusive(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    //убирает из массива дубликаты и оставляет только уникальные значения
    function arrayUnique(sourceArray)
    {
        let uniqueArray = [];
        sourceArray.forEach(function(item) {
            //если элемента еще нет в массиве, добавить его туда
            if (uniqueArray.indexOf(item) === -1) {
                uniqueArray.push(item);
            }
        });

        return uniqueArray;
    }

    root.registerModule({
        id: 'utils',
        init: init,
        getRandomIntInclusive: getRandomIntInclusive,
        arrayUnique: arrayUnique

    });

})(window.ElevatorSimulator2021);