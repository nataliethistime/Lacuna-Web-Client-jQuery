// This is a module containing all the building data returned by
// the call to 'body/get_buildings'
// It is not a collection of 'building.js' modules.
//
define(['jquery', 'underscore'], function($, _) {
    function Buildings() {
        var scope = this;
        scope.buildings = {};
        scope.callbacks = {};

        // Get the unique ID for a plot
        scope.get_idStr = function(x,y) {
            return 'plot_' + x + '_' + y;
        };

        // Create a set of 'buildings' objects. Initially it will be
        // empty, but will be populated on each call to get_buildings
        for (var x = -5; x < 6; x++) {
            for (var y = -5; y < 6; y++) {
                 var idStr = scope.get_idStr(x,y);
                 scope.buildings[idStr] = {};
                 scope.callbacks[idStr] = $.Callbacks();
            }
        }

        // Return a single building based on the x,y co-ordinate
        scope.get_building_at_xy = function(x,y) {
            var idStr = scope.get_idStr(x,y);
            return scope.buildings[idStr];
        };

        // callback methods on change of a building
        scope.callbackAdd = function(x, y, callback) {
            scope.callbacks[scope.get_idStr(x, y)].add(callback);
        };
        scope.callbackRemove = function(x, y, callback) {
            scope.callbacks[scope.get_idStr(x, y)].remove(callback);
        };

        scope.update = function(loaded_buildings) {
            var keys = Object.keys(loaded_buildings);

            for (var i = 0; i < keys.length; i++) {
                var new_building    = loaded_buildings[keys[i]],
                    idStr           = scope.get_idStr(new_building.x, new_building.y)
                ;
                // add a few useful bits to the new building
                //new_building.id     = keys[i];
                new_building.idStr  = idStr;
                new_building.id     = keys[i];

                // Update the current building only if there is a change
                if ( ! _.isEqual(scope.buildings[idStr], new_building)) {
                    scope.buildings[idStr] = new_building;
                    scope.callbacks[idStr].fire(new_building);
                }
            }
        };
    }

    return new Buildings();
});
