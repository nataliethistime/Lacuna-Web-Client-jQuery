// This contains the current Empire data, typically updated from any 'Status' return
//
define(['jquery', 'underscore', 'lacuna'], function($, _, Lacuna) {
    function Empire() {
        var scope = this;
        
        // Getter of the latest Empire block. Usage: Empire.get.<item>
        scope.get = {};

        // Callback method to be called whenever Lacuna.send is done
        scope.update = function(newStatus) {
            var newEmpire = newStatus.empire;

            if (!newEmpire) {
                return;
            }

            if ( ! _.isEqual(scope.get, newEmpire)) {
                scope.get = _.clone(newEmpire);
            }
        };

        // Tell Lacuna to call Empire.update when new empire data comes in.
        // Note: needs to be defined after the definition of scope.update.
        Lacuna.callbacks.add(scope.update);

        // Clears all data.
        scope.destroy = function() {
            scope.get = {};
        };
    }

    return new Empire();
});
