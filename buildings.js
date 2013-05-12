// This is a module containing all the building data returned by
// the call to 'get_buildings'
// It is not a collection of 'building.js' modules
//
define(['jquery', 'underscore', 'lacuna'], function($, _, Lacuna) {
    function Buildings() {
        var scope = this;
        var buildings = {};
        var callbacks = {};

        // Create a set of 'buildings' objects. Initially it will be
        // empty, but will be populated on each call to get_buildings
        for (var x = -5; x < 6; x++) {
            for (var y = -5; y < 6; y++) {
                 var idStr = scope.get_idStr(x,y);
                 buildings[idStr] = {};
                 callbacks[idStr] = $.Callbacks();
            }
        }

        // Get the unique ID for a plot
        this.get_idStr = function(x,y) {
            return 'plot_' + x + '_' + y;
        };

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

        // Refresh everything, get the buildings from the server
        this.get_buildings = function(body_id) {
            Lacuna.send({
                module: '/body',
                method: 'get_buildings',
                params: [
                    Lacuna.getSession(),
                    body_id
                ],
                success: function(o) {
                    var loaded_buildings    = o.result.buildings,
                        keys                = Object.keys(buildings)
                    ;
                    for (var i = 0; i < keys.length; i++) {
                        var new_building    = loaded_buildings[keys[i]],
                            idStr           = scope.get_idStr(building.x, building.y)
                        ;
                        // Update the current building only if there is a change
                        if ( ! _.isEqual(buildings[idStr], new_building)) {
                            callbacks[idStr].fire();
                            buildings[idStr] = new_building;
                        }
                    }
                }
            });
        };
    }

    return new Buildings();
});