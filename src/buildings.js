// This is a module containing all the building data returned by
// the call to 'get_buildings'
// It is not a collection of 'building.js' modules.
//
define(['jquery', 'underscore'], function($, _) {
    function Buildings() {
        var scope = this;
        var buildings = {};
        var callbacks = {};

        // Get the unique ID for a plot
        this.get_idStr = function(x,y) {
            return 'plot_' + x + '_' + y;
        };

        // Create a set of 'buildings' objects. Initially it will be
        // empty, but will be populated on each call to get_buildings
        for (var x = -5; x < 6; x++) {
            for (var y = -5; y < 6; y++) {
                 var idStr = scope.get_idStr(x,y);
                 buildings[idStr] = {};
                 callbacks[idStr] = $.Callbacks();
            }
        }

        // Return a single building based on the x,y co-ordinate
        this.get_building_at_xy = function(x,y) {
            var idStr = scope.get_idStr(x,y);
            return buildings[idStr];
        };

        // callback methods on change of a building
        this.callback_add = function(x, y, callback) {
            callbacks[scope.get_idStr(x, y)].add(callback);
        };
        this.callback_remove = function(x, y, callback) {
            callbacks[scope.get_idStr(x, y)].remove(callback);
        };

        this.update = function(loaded_buildings) {
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
                if ( ! _.isEqual(buildings[idStr], new_building)) {
                    buildings[idStr] = new_building;
                    callbacks[idStr].fire(new_building);
                }
            }
         };
    }

    return new Buildings();
});
