define(['jquery'], function($) {
    function Library() {

        // Returns true/false if the specified element exists.
        this.elExists = function(name) {
            return $('#' + name).length > 0;
        };

        // Converts 123456789 into 123,456,789.
        // sorry, spaces in numbers is non-standard
        this.formatNum = function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        // take an array of day:hour:minute:second arrival time and convert to UST
        //
        this.formatDateEarliestToUST = function(inArray) {
            var seconds = (((inArray[0] * 24 + inArray[1]) * 60) + inArray[2]) * 60 + inArray[3];
            var arrivalTime = Date.now() + seconds * 1000;
            return arrivalTime.toUTCString();

        };

        // take an array of day:hour:minute:second arrival time and convert to the browsers localtime
        this.formatDateEarliestToLocal = function(inArray) {
            var utcString = this.formatDateEarliestToUST(inArray);
            var arrivalTime = Date(utcString);
            return arrivalTime.toString();
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
