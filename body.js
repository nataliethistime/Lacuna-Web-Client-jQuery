// This contains the current Body data, typically updated from any 'Status' return
//
define(['require', 'jquery', 'underscore','buildings'], function(require, $, _, Buildings) {
    function Body() {
        var scope = this;
        var callbacks = $.Callbacks();
        var backgroundCallbacks = $.Callbacks();
        
        this.get;
        this.surface_image;

        this.update = function(new_body) {
            // 'new_body' can either be the 'body' from the get_buildings call (only surface_image is returned)
            // or the complete body details.
            //
            if ( new_body.id && ! _.isEqual(scope.get, new_body)) {
                var refresh_buildings = 0;
                if ( ! scope.get || scope.get.surface_version != new_body.surface_version) {
                    refresh_buildings = 1;
                }
                scope.get = new_body;

                callbacks.fire(scope.get);
                if (refresh_buildings) {
                    scope.get_buildings(new_body.id);
                }
            }
            if (new_body.surface_image && new_body.surface_image != scope.surface_image) {
                scope.surface_image = new_body.surface_image;
                backgroundCallbacks.fire(scope.surface_image);
            }
        };

        this.get_buildings = function(body_id) {
            // We may want to revisit this, otherwise there is a circular dependency.
            require(['lacuna'], function(lacuna) {
                lacuna.send({
                    module: '/body',
                    method: 'get_buildings',
                    params: [
                        lacuna.getSession(),
                        body_id
                    ],
                    success: function(o) {
                        // Update all the buildings
                        Buildings.update(o.result.buildings);
                        // Update the surface image
                        scope.update(o.result.body);
                    }
                });
            });
        };
        
        // callback methods on change of body details
        this.callback_add = function(callback) {
            callbacks.add(callback);
        };
        this.callback_remove = function(callback) {
            callbacks.remove(callback);
        };
        this.backgroundCallbackAdd = function(callback) {
            backgroundCallbacks.add(callback);
        };
        this.backgroundCallbackRemove = function(callback) {
            backgroundCallbacks.remove(callback);
        };
        this.backgroundCallbackFire = function() {
            backgroundCallbacks.fire(scope.surface_image);
        };
    }

    return new Body();
});
