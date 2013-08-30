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
            // body information can be in one of
            //   'result.status.body'   # Complete data of the body
            //   'result.body'          # Complete data of the body
            //   'result.body'          # only the 'surface_image' in the case of call to get_buildings
            //

            var newBody = newStatus.body;

            if (!newBody) {
                return;
            }

            console.log(newBody);//debug

            // Just merge the fucking thing.
            if ( ! _.isEqual(scope.get, newBody)) {
                _.extend(scope.get, newBody);
            }

            // TODO: code something that updates the surface image of a body.
            // TODO: code something that updates the planet info and list at the bottom of the screen.
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
