// This contains the current Body data, typically updated from any 'Status' return
//
define(['jquery', 'underscore', 'lacuna'], function($, _, Lacuna) {
    function Body() {
        var scope = this;
        scope.backgroundCallbacks = $.Callbacks();
        
        // Getter of the latest Body block. Usage:  Body.get.<item>
        scope.get = {};
        scope.surface_image = '';

        // Update the body data with the data returned from the server
        scope.update = function(newStatus) {

            var newBody = newStatus.body;

            if (!newBody) {
                return;
            }

            if (newBody.surface_image && scope.surface_image !== newBody.surface_image) {
                scope.surface_image = newBody.surface_image;
                scope.backgroundCallbacks.fire(scope.surface_image);
            }

            // Just merge the fucking thing. 'nuff said.
            if ( ! _.isEqual(scope.get, newBody)) {
                _.extend(scope.get, newBody);
            }
        };

        // General purpose destroy method, used when the game logs out.
        scope.destroy = function() {
            scope.get = {};
            scope.surface_image = '';
        };

        // Tell Lacuna to call Body.update when new body data comes in.
        // Note: needs to be defined after the definition of scope.update.
        Lacuna.callbacks.add(scope.update);
    }

    return new Body();
});
