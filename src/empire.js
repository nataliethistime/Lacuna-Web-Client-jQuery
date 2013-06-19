// This contains the current Empire data, typically updated from any 'Status' return
//
define(['jquery', 'underscore', 'lacuna'], function($, _, Lacuna) {
    function Empire() {
        var scope = this;
        
        // callbacks that want to be informed when the Empire status changes
        scope.callbacks = $.Callbacks();
        
        // Get the empire data itself
        scope.get = {};

        // Callback method to be called whenever Lacuna.send is done
        scope.updateEmpire = function(o) {
            if (o.result.status) {
                // Empire data can come directly from the result or from the status
                var empireData = o.result.status.empire || o.result.empire;
                if ( ! _.isEqual(scope.get, empireData)) {
                    scope.get = _.clone(empireData);
                    // Fire all callbacks that care about Empire changes.
                    scope.callbacks.fire(scope.get);
                }
            }
        };

        Lacuna.callbacks.add(scope.updateEmpire);

        // Specific call to get the empire status (not usually needed)
        // 
        scope.get_status = function() {
            var deferredStatus = Lacuna.send({
                module  : '/empire',
                method  : 'get_status',
                params  : [
                    Lacuna.getSession()
                ]
            });
            // We don't actually care about the 'done' since updateEmpire is called
            // via a callback in Lacuna
        };
    }

    return new Empire();
});
