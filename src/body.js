// This contains the current Body data, typically updated from any 'Status' return
//
define(['jquery', 'underscore', 'buildings', 'lacuna'], function($, _, Buildings, Lacuna) {
    function Body() {
        var scope = this;
        scope.callbacks = $.Callbacks();
        scope.backgroundCallbacks = $.Callbacks();
        
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
                scope.callbacks.fire(scope.get);
                if (refresh_buildings) {
                    scope.get_buildings(newBody.id);
                }
            }
        };

        // Register an interest in the data returned from the server API calls
        Lacuna.callbacks.add(scope.update);

        // Make a call to get this bodies buildings
        // 
        scope.get_buildings = function(body_id) {
            var deferredGetBuildings = Lacuna.send({
                module  : '/body',
                method  : 'get_buildings',
                params  : [
                    Lacuna.getSession(),
                    body_id
                ]
            });
            deferredGetBuildings.done(function(o) {
                // Update all the buildings
                Buildings.update(o.result.buildings);
            });
        };
    }

    return new Body();
});
