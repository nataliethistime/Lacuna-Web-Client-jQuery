// This contains the current Body data, typically updated from any 'Status' return
//
define(['require', 'jquery', 'underscore','buildings'], function(require, $, _, Buildings) {
    function Body() {
        var scope = this;
        var callbacks = $.Callbacks();

        this.get;

        this.update = function(new_body) {
            // We only have to update if there is an actual change.
            // the check for id is because get_buildings returns a body.surface_image but nothing else!
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
        };

        this.get_buildings = function(body_id) {
            // We may want to revisit this, otherwise there is a circular dependency.
            require(['lacuna'], function(Lacuna) {
                Lacuna.send({
                    module: '/body',
                    method: 'get_buildings',
                    params: [
                        Lacuna.getSession(),
                        body_id
                    ],
                    success: function(o) {
                        Buildings.update(o);
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
    }

    return new Body();
});
