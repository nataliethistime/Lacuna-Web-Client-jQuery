// Module to manage the live timers that are in the client.
//

define(['jquery', 'underscore', 'library'], function($, _, Library) {
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
        this.queueItems = [];

        // The real looper.
        this.looper = "something that isn't a function";

        // Boolean to track weather the queue is
        // running. Used to prevent multiple queue
        // instances. If there's more than one, 
        // they can't stopped.
        this.isQueueRunning = false;

        this.addQueueItem = function(name, time, callback) {
            // Should do a check here for duplicates.
            scope.queueItems[scope.queueItems.length] = {
                currentTime: time,
                parent: name,
                finish: callback || function(){}
            };
        };

        // Removes the item from the queue based off
        // of it's parent name. Need to handle duplicate
        // items.
        this.remQueueItem = function(parent) {
            // Loop through and find the item.
            for (var i = 0; i < scope.queueItems.length; i++) {
                if (scope.queueItems[i].parent === parent) {
                    // Set the item to false...
                    scope.queueItems[i] = false;

                    // ... so that underscore can clean it up.
                    scope.queueItems = _.compact(scope.queueItems);

                    // Lastly, stop checking.
                    break;
                }
            }
        };

        // The function that loops through the
        // queue items and updates as needed.
        this.loop = function() {
            // Make sure the queue is meant to be running.
            if (scope.isQueueRunning) {
                
                _.each(scope.queueItems, function(item, index) {

                    var increment = item.direction === 'up' ? -1 : 1,
                        newTime   = Library.formatTime((item.currentTime * 1) - increment),
                        el        = document.getElementById(item.parent)
                    ;

                    if (el) {
                        el.innerHTML = newTime;

                        // Update the object containing the actual value.
                        scope.queueItems[index].currentTime -= increment;
                    }

                    // Something destroyed the element and it needs to be removed from
                    // the queue.
                    else {
                        scope.remQueueItem(item);
                    }
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

        // Stops the loop.
        this.stop = function() {

            // Attempting to do this if the queue isn't
            // running doesn't throw and JS errors, but 
            // I prefer to live on the safe side.
            if (this.isQueueRunning) {
                clearInterval(scope.looper);
                scope.isQueueRunning = false;
                scope.looper = "something that isn't a function";
            }
        
        };

        // Clears everything in the queue, doesn't stop it.
        this.killall = function() {
            scope.queueItems = [];
        };
    }

    return new Queue();
});
