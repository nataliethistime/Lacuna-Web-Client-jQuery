define(['jquery', 'lacuna', 'template', 'text!templates/building/shipyard.tmpl'], 
function($, Lacuna, Template, TmplBuildingShipyard) {
    
    Template.loadStrings(TmplBuildingShipyard);

    function Shipyard() {
        var scope = this;

        scope.getTabs = function() {
            return [
                {
                    name: 'Build Queue',
                    select: scope.populateQueueTab
                },
                {
                    name: 'Build Fleets',
                    select: scope.populateBuildTab
                }
            ];
        };

        scope.populateQueueTab = function(tab) {
            var deferredViewBuildQueue = Lacuna.send({
                module  : '/shipyard',
                method  : 'view_build_queue',
                params  : [{
                    session_id      : Lacuna.getSession(),
                    building_id     : scope.building.id,
                    no_paging       : 1
                }]
            });

            deferredViewBuildQueue.done(function(o) {
                var content = [];

                if (o.result.number_of_fleets_building > 0) {
                    // Add ships to queue and post to DOM.
                    _.each(o.result.ships_building, function(shipBuilding) {
                        content[content.length] = Template.read.building_shipyard_build_ship_item({
                            // TODO
                        });
                    });
                }
                else {
                    // No ships are currently building.
                    tab.add('<span class="center">No ships are currently building at this Shipyard.</span>');
                }
            });
        };

        scope.populateBuildTab = function(tab) {
            var content              = [],
                deferredGetBuildable = Lacuna.send({
                module: '/shipyard',
                method: 'get_buildable',

                params: [
                    Lacuna.getSession(),
                     scope.building.id
                ]
            });

            deferredGetBuildable.done(function(o) {
                _.each(o.result.buildable, function(ship) {
                    content.push(Template.read.building_shipyard_build_ship_item({
                        ship: JSON.stringify(ship),
                        assetsUrl: window.assetsUrl
                    }));
                });
            });

            tab.html([
                '<ul>',
                    content.join(''),
                '</ul>'
            ].join(''));
        };
    }

    return new Shipyard();
});
