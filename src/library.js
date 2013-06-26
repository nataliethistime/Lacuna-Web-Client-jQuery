define(['jquery'], function($) {
    function Library() {

        // Returns true or false if the specified element exists.
        this.elExists = function(name) {
            return $('#' + name).length > 0;
        };

        // Converts 123456789 into 123,456,789.
        this.formatNum = function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        this.reduceNum = function(number) {
            if (number >= 100000000000000000 || number <= -100000000000000000) {
                //101Q
                return Math.floor(number/1000000000000000) + 'Q';
            }
            else if (number >= 1000000000000000 || number <= -1000000000000000) {
                //75.3Q
                return (Math.floor(number/100000000000000) / 10) + 'Q';
            }
            else if (number >= 100000000000000 || number <= -100000000000000) {
                //101T
                return Math.floor(number/1000000000000) + 'T';
            }
            else if (number >= 1000000000000 || number <= -1000000000000) {
                //75.3T
                return (Math.floor(number/100000000000) / 10) + 'T';
            }
            else if (number >= 100000000000 || number <= -100000000000) {
                //101B
                return Math.floor(number/1000000000) + 'B';
            }
            else if (number >= 1000000000 || number <= -1000000000) {
                //75.3B
                return (Math.floor(number/100000000) / 10) + 'B';
            }
            else if (number >= 100000000 || number <= -100000000) {
                //101M
                return Math.floor(number/1000000) + 'M';
            }
            else if (number >= 1000000 || number <= -1000000) {
                //75.3M
                return (Math.floor(number/100000) / 10) + 'M';
            }
            else if (number >= 10000 || number <= -10000) {
                //123k
                return Math.floor(number/1000) + 'k';
            }
            else {
                //8765
                return Math.floor(number) || "0";
            }
        },

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
                return [day, this.lengthen(hour), this.lengthen(min), this.lengthen(seconds)].join(':');
            }
            else if (hour > 0) {
                return [hour, this.lengthen(min), this.lengthen(seconds)].join(':');
            }
            else {
                return [this.lengthen(min), this.lengthen(seconds)].join(':');
            }
        };

        this.lengthen = function(number) {
            number = number.toString();
            
            if (number.length === 1) {
                return "0" + number;
            }
            else {
                return number;
            }
        };

        this.upperFirstChar = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        this.foodTypes = [
            "algae",
            "apple",
            "bean",
            "beetle",
            "burger",
            "bread",
            "cheese",
            "chip",
            "cider",
            "corn",
            "fungus",
            "lapis",
            "meal",
            "milk",
            "pancake",
            "pie",
            "potato",
            "root",
            "shake",
            "soup",
            "syrup",
            "wheat"
        ];

        this.oreTypes = [
            "anthracite",
            "bauxite",
            "beryl",
            "chromite",
            "chalcopyrite",
            "fluorite",
            "galena",
            "goethite",
            "gold",
            "gypsum",
            "halite",
            "kerogen",
            "magnetite",
            "methane",
            "monazite",
            "rutile",
            "sulfur",
            "trona",
            "uraninite",
            "zircon"
        ];
        // function to return an interval with notification
        //  'millis' is the time in milliseconds between notifications
        //  'count'  is the number of times to iterate.
        //  
        this.notifyTimer = function(millis, count) {
            var deferred = $.Deferred();
            if (count <= 0) {
                deferred.reject("Negative repeat count "+count);
            }
            var iteration = 0;
            var id = setInterval(function() {
                deferred.notify(++iteration, count);
                if (iteration >= count) {
                    clearInterval(id);
                    deferred.resolve();
                }
            }, millis);
            return deferred.promise();
        };
        // function to notify forever (well, at least until it goes out of scope)
        //
        this.notifyTimerInfinite = function(millis) {
            var deferred = $.Deferred();
            var iteration = 0;
            var id = setInterval(function() {
                deferred.notify(++iteration);
            }, millis);
            return deferred.promise();
        };
    }

    return new Library();
});
