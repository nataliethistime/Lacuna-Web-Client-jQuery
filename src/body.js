// This contains the current Body data, typically updated from any 'Status' return
//
define(['jquery', 'underscore', 'lacuna'], function($, _, Lacuna) {
    function Body() {
        var scope = this;
        scope.backgroundCallbacks = $.Callbacks();
        
        // Getter of the latest Body block. Usage:  Body.get.<item>
        scope.get = {};
        scope.surface_image = '';

        // Update the body data from the data returned from the server
        scope.update = function(o) {
            // body information can be in one of
            //   'result.status.body'   # Complete data of the body
            //   'result.body'          # Complete data of the body
            //   'result.body'          # only the 'surface_image' in the case of call to get_buildings
            //
            
            var newBody = o.result.body;
            if (newBody && newBody.surface_image) {
                if (newBody.surface_image !== scope.surface_image) {
                    scope.surface_image = newBody.surface_image;
                    scope.backgroundCallbacks.fire(scope.surface_image);
                }
                newBody = o.result.status.body;
            }
            if (o.result.body) {
                newBody = o.result.body;
                if (newBody.surface_image && newBody.surface_image !== scope.surface_image) {
                    scope.surface_image = newBody.surface_image;
                    scope.backgroundCallbacks.fire(scope.surface_image);
                }
            }
            else if (o.result.status && o.result.status.body) {
                newBody = o.result.status.body;
            }

            if (newBody && newBody.id) {
                var refresh_buildings = 0;
                if (scope.get) {
                    if (scope.get.surface_version !== newBody.surface_version) {
                        refresh_buildings = 1;
                    }
                }
                else {
                    scope.get = {};
                    refresh_buildings = 1;
                }
                _.extend(scope.get, newBody);
                
                if (refresh_buildings) {
                    // Refresh the planet view but don't fadeout and in again.
                    // Instead, just update the specific building.
                }
            }
        };

        // Clears all data.
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
