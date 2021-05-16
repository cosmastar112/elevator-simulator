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

    root.registerModule({
        id: 'utils',
        init: init,
        getRandomIntInclusive: getRandomIntInclusive

    });

})(window.ElevatorSimulator2021);