define(['jquery'], function($) {
    function Library() {

        // Returns true/false if the specified element exists.
        this.elExists = function(name) {
            return $('#' + name).length > 0;
        };

        // Converts 123456789 into 123,456,789.
        this.formatNum = function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        // This was stolen straight from the original Lacuna Web Client.
        this.formatTime = function(input) {
            if (input < 0) {
                return '';
            }
            var secondsInDay = 60 * 60 * 24,
                secondsInHour = 60 * 60,
                day = Math.floor(input / secondsInDay),
                hleft = input % secondsInDay,
                hour = Math.floor(hleft / secondsInHour),
                sleft = hleft % secondsInHour,
                min = Math.floor(sleft / 60),
                seconds = Math.floor(sleft % 60);
            if (day > 0) {
                return [day, hour, min, seconds].join(':');
            } else if (hour > 0) {
                return [hour, min, seconds].join(':');
            } else {
                return [min, seconds].join(':');
            }
        };
    }

    return new Library();
});
