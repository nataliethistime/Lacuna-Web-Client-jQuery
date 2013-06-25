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
        scope.queueItems = [];

        // The real looper.
        scope.looper = "something that isn't a function";

        // Boolean to track weather the queue is
        // running. Used to prevent multiple queue
        // instances. If there's more than one, 
        // they can't stopped.
        scope.isQueueRunning = false;

        scope.addQueueItem = function(name, time, callback) {
            // Should do a check here for duplicates.
            scope.queueItems.push({
                currentTime : time,
                parent  : name,
                finish  : callback || function(){}
            });
        };

        // Removes any items from the queue based on their parents name.
        // 
        scope.remQueueItem = function(parent) {
            // Let grep remove the items (even duplicates)
            scope.queueItems = $.grep(scope.queueItems, function(a) {
                return a.parent !== parent;
            });
        };

        // The function that loops through the
        // queue items and updates as needed.
        scope.loop = function() {
            // Make sure the queue is meant to be running.
            if (scope.isQueueRunning) {
                
                _.each(scope.queueItems, function(item, index) {

                    var increment = item.direction === 'up' ? 1 : -1,
                        newTime   = Library.formatTime(parseInt(item.currentTime, 10) + increment),
                        el        = document.getElementById(item.parent)
                    ;

                    if (el && parseInt(item.currentTime, 10) > 0 ) {
                        el.innerHTML = newTime;

                        // Update the object containing the actual value.
                        scope.queueItems[index].currentTime -= increment;
                    }
                    else {
                        // Something destroyed the element and it needs to be removed from
                        // the queue or the timer ran out.
                        scope.remQueueItem(item);
                    }
                });
            
            }
        };

        // Starts the loop, should be called when the 
        // user logs in and when planets get changed.
        scope.start = function() {
            // Don't start the queue if there's already
            // one running.
            if (!scope.isQueueRunning) {
                scope.looper = setInterval(scope.loop, 1000);
                scope.isQueueRunning = true;
            }
        };

        // Stops the loop.
        scope.stop = function() {

            // Attempting to do this if the queue isn't
            // running doesn't throw and JS errors, but 
            // I prefer to live on the safe side.
            if (scope.isQueueRunning) {
                clearInterval(scope.looper);
                scope.isQueueRunning = false;
                scope.looper = "something that isn't a function";
            }
        
        };

        // Clears everything in the queue, doesn't stop it.
        scope.killall = function() {
            scope.queueItems = [];
        };
    }

    return new Queue();
});
