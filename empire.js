// This contains the current Empire data, typically updated from any 'Status' return
//
define(['jquery', 'underscore'], function($, _) {
    function Empire() {
        var scope = this;
        var callbacks = $.Callbacks();

        this.get;

        this.update = function(new_empire) {

            if ( ! _.isEqual(scope.get, new_empire)) {
                scope.get = _.clone(new_empire);
                callbacks.fire(scope.get);
            }

        };

        this.get_status = function() {
            Lacuna.send({
                module: '/empire',
                method: 'get_status',
                params: [
                    Lacuna.getSession()
                ],
                success: Empire.update
            });
        };
        
        // callback methods on change of empire details
        this.callback_add = function(callback) {
            callbacks.add(callback);
        };
        this.callback_remove = function(callback) {
            callbacks.remove(callback);
        };
    }

    return new Empire();
});
