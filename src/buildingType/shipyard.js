define(['jquery', 'underscore', 'lacuna', 'template', 'library', 'text!templates/building/shipyard.tmpl'], 
function($, _, Lacuna, Template, Library, TmplBuildingShipyard) {
    
    Template.loadStrings(TmplBuildingShipyard);

    function Shipyard() {
        var scope = this;

        scope.getTabs = function() {
            return [
                {
                    name: 'Build Queue',
                    select: scope.getQueue
                },
                {
                    name: 'Build Fleets',
                    content: Template.read.building_shipyard_buildable_container(),
                    select: scope.getBuildable
                },
                {
                    name: 'Repair Fleets',
                    content: 'TODO'
                    // TODO
                }
            ];
        };

        scope.getQueue = function(tab) {
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
                scope.queueTab = tab;
                scope.populateQueueTab(o.result.ships_building);
            });
        };

        scope.getBuildable = function(tab) {
            var deferredGetBuildable = Lacuna.send({
                module: '/shipyard',
                method: 'get_buildable',

                params: [
                    Lacuna.getSession(),
                    scope.building.id
                ]
            });

            deferredGetBuildable.done(function(o) {
                scope.buildableTab = tab;
                scope.populateBuildableTab(o.result.buildable);
            });
        };

        scope.populateQueueTab = function(fleetsBuilding) {
            var content = []
            ;

            if (!fleetsBuilding.length) {
                // No ships are currently building.
                scope.queueTab.html('<p class="centerText">No fleets are currently building at this Shipyard.</p>');
                return;
            }

            while (fleetsBuilding.length) {
                var fleet = fleetsBuilding.pop();

                content.push(Template.read.building_shipyard_build_queue_item({
                    fleet : fleet
                }));
            }

            console.log(scope);//debug
            // undefined because the tab has never been selected. Fuck.
            scope.queueTab.html(content.join(''));
        };

        scope.populateBuildableTab = function(buildable) {

            var content = [],
                keys    = _.keys(buildable).sort()
            ;
                
            _.each(keys, function(key) {
                var fleet = buildable[key];

                content.push(Template.read.building_shipyard_build_fleet_item({
                    assetsUrl: window.assetsUrl,
                    fleet: fleet,
                    fleetType: key,
                    library: Library
                }));

                if (fleet.can) {
                    // Remove any previous instances of the click event.
                    $(document).off('click', '#' + key + '_button');

                    // Then add the new one.
                    $(document).on(
                        'click',
                        '#' + key + '_button',
                        {type: key},
                        scope.buildFleet
                    );
                }

            });
                
            $('#fleetsBuildableContainer').html([
                "<ul>",
                content.join(''),
                "</ul"
            ].join(''));
        };

        scope.buildFleet = function(e) {

            var deferredBuildFleet = Lacuna.send({
                module: '/shipyard',
                method: 'build_fleet',

                params: [{
                    session_id  : Lacuna.getSession(),
                    building_id : scope.building.id,
                    type        : e.data.type,
                    quantity    : $('#' + e.data.type + '_quantity').val() || 1
                }]
            });

            deferredBuildFleet.done(function(o) {
                scope.buildableTab.gotoTab(1);
                console.log(o);//debug
                scope.populateQueueTab(o.result.fleets_building);
            });
        };
    }

    return new Shipyard();
});
