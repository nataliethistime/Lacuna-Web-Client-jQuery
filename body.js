// This contains the current Body data, typically updated from any 'Status' return
//
define(['jquery', 'underscore','buildings'], function($, _, Buildings) {
    function Body() {
        var scope = this;
        var callbacks = $.Callbacks();

        this.get;

        this.update = function(new_body) {
            if ( ! _.isEqual(scope.get, new_body)) {
                scope.get = _.clone(new_body);
                callbacks.fire(scope.get);
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
                    success: Buildings.update
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