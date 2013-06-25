// This contains the current Empire data, typically updated from any 'Status' return
//
define(['jquery', 'underscore', 'lacuna'], function($, _, Lacuna) {
    function Empire() {
        var scope = this;
        
        // Getter of the latest Empire block. Usage: Empire.get.<item>
        scope.get = {};

        // Callback method to be called whenever Lacuna.send is done
        scope.update = function(o) {
            if (o.result.status) {
                // Empire data can come directly from the result or from the status
                var empireData = o.result.status.empire || o.result.empire;
                if ( ! _.isEqual(scope.get, empireData)) {
                    scope.get = _.clone(empireData);
                }
            }
        };

        // Tell Lacuna to call Empire.update when new empire data comes in.
        // Note: needs to be defined after the definition of scope.update.
        Lacuna.callbacks.add(scope.update);

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
        };

        // Clears all data.
        scope.destroy = function() {
            scope.get = {};
        };
    }

    return new Empire();
});
