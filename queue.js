// Module to manage the live timers that are in the client.
//

define(['jquery', 'underscore'], function($, _) {
    function Queue() {

        // Array of Objects containing all the timers 
        // that need updating, used in the continuous
        // loop below.
        this.queueItems = [];

        this.addQueueItem = function(item) {
            // TODO
        };

        this.remQueueItem = function(item) {
            // TODO
        };

        // The actual function that loops through the
        // queue items and updates as needed.
        this.loop = function() {
            // TODO
        };

        // Starts the loop, should be called when the 
        // user logs in.
        this.start = function() {
            // TODO
        };

        // Stops the loop, should be called when the
        // user changes planets.
        this.stop = function() {
            // TODO
        }
    }

    return new Queue();
}
