define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    Template.load('building/shipyard');

    function Shipyard() {
        var scope = this;

        this.getTabs = function() {
            return [
                {
                    name: 'Build Queue',
                    content: Template.read.building_shipyard_build_queue_tab(),
                    select: this.getQueueTab
                },
                {
                    name: 'Build Fleets',
                    content: Template.read.building_shipyard_build_ship_tab()
                }
            ];
        };

        this.getQueueTab = function(tab) {
            Lacuna.send({
                module: scope.building.url,
                method: 'view_build_queue',

                params: [
                    Lacuna.getSession(), // Session Id
                    scope.building.id, // Building Id
                    1 // Page number
                ],

                success: function(o) {
                    tab.add(JSON.stringify(o.result));

                    if (o.result.ships_building.length > 0) {
                        // Add ships to queue and post to DOM.
                        tab.add(JSON.stringify(o.result.ships_building)); // Meh...
                    }
                    else {
                        // No ships are currently building.
                        tab.add('<span class="center">No ships are currently building at this Shipyard.</span>');
                    }
                }
            });
        }
    }

    return new Shipyard();
});
