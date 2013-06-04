// Module to manage the live timers that are in the client.
//

define(['jquery', 'underscore'], function($, _) {
    function Queue() {
        var scope = this;

        // Array of Objects containing all the timers 
        // that need updating, used in the continuous
        // loop below.
        // Each queue item should look like the following:
        // {
        //      currentTime: 500,
        //      parent: 'elementId'
        //      finish: function(args) {
        //          // Do stuff when timer finishes
        //      }
        // }
        this.queueItems = ['Test', 'test'];

        // The real looper.
        this.looper = "something isn't a function";

        // Boolean to track weather the queue is
        // running. Used to prevent multiple queue
        // instances. If there's more than one, 
        // they can't stopped.
        this.isQueueRunning = false;

        this.addQueueItem = function(item) {
            // TODO
        };

        this.remQueueItem = function(item) {
            // TODO
        };

        // The function that loops through the
        // queue items and updates as needed.
        this.loop = function() {
            // Make sure the queue is meant to be running.
            if (scope.isQueueRunning) {
                
                _.each(scope.queueItems, function(item) {
                    console.log(item);//debug
                });
            
            }
        };

        // Starts the loop, should be called when the 
        // user logs in and when plants get changed.
        this.start = function() {
            // Don't start the queue if there's already
            // one running.
            if (!scope.isQueueRunning) {
                scope.looper = setInterval(scope.loop, 1000);
                scope.isQueueRunning = true;
            }
        };

        // Stops the loop, should be called when the 
        // user logs out and when plants get changed.
        this.stop = function() {

            // Attempting to do this if the queue isn't
            // running doesn't throw and JS errors, but 
            // I prefer to live on the safe side.
            if (this.isQueueRunning) {
                clearInterval(scope.looper);
                scope.isQueueRunning = false;
            }
        
        };
    }

    return new Queue();
});
