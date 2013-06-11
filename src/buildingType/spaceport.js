define(['jquery', 'lacuna', 'library', 'template', 'body'], function($, Lacuna, Library, Template, Body) {
    
    Template.load('building/spacePort');

    function SpacePort() {
        var scope = this;

        // request view_all_fleets and update the tab with the result
        scope.viewAllFleets = function(vBuilding, url) {
            Lacuna.send({
                module: url,
                method: 'view_all_fleets',

                params: [{
                    session_id      : Lacuna.getSession(),
                    building_id     : vBuilding.id,
                }],
                success: function(o) {

                    var content = [];

                    if (o.result.number_of_fleets <= 0) {
                        content.push(Template.read.building_space_port_no_ships({}));
                    }
                    else {
                        _.each(o.result.fleets, function(fleet) {
                            content.push(Template.read.building_space_port_view_item({
                                assetsUrl   : window.assetsUrl,
                                fleet       : fleet,
                                Library     : Library
                            }));
                        });
                    }
                    $("#fleet_view_details").html(content.join(''));
                    scope.addEvents(vBuilding, url);
                }
            });
        };

        // Get the various tabs
        scope.getTabs = function(vBuilding, url) {
            scope.viewAllFleets(vBuilding, url);

            return [
                {
                    name    : 'Fleets',
                    content : Template.read.building_space_port_view_list({})
                }
            ];
        };

        // Add the various event handlers
        scope.addEvents = function(vBuilding, url) {
            // Add event handlers for renaming ships
            var $fleet_view_details = $('#fleet_view_details');

            // click on a ship name brings up the edit form
            $fleet_view_details.on('click', '.fleet_name', function(event) {
               var $this = $(this);
               $this.addClass('hidden');
               $this.next().removeClass('hidden');
            });
            // click on 'cancel' button removes the edit form
            $fleet_view_details.on('click', '.fleet_name_cancel_button', function(event) {
                var $this = $(this);
                var $parent = $this.parent();
                $parent.prev().removeClass('hidden');
                $parent.addClass('hidden');
            });
            // click on 'rename' button submits the rename
            $fleet_view_details.on('click', '.fleet_name_rename_button', function(event) {
                var $this = $(this);
                var $parent = $this.parent();
                $parent.prev().removeClass('hidden');
                $parent.addClass('hidden');
                var fleetId     = $parent.parent().children().first().val();
                var fleetName   = $parent.children('.fleet_new_name').first().val();
                var fleetQty    = $parent.children('.fleet_rename_quantity').first().val();
                Lacuna.send({
                    module: url,
                    method: 'rename_fleet',

                    params: [{
                        session_id      : Lacuna.getSession(),
                        building_id     : vBuilding.id,
                        fleet_id        : fleetId,
                        name            : fleetName,
                        quantity        : fleetQty
                    }],
                    success: function(o) {
                        scope.viewAllFleets(vBuilding, url);
                    }
                });    
            });
            // click on 'scuttle' button submits the request
            $fleet_view_details.on('click', '.fleet_scuttle_button', function(event) {
                var $this       = $(this);
                var $parent     = $this.parent();
                var fleetId     = $parent.children().first().val();
                var fleetQty    = $parent.children('.fleet_scuttle_quantity').first().val();
                Lacuna.send({
                    module  : url,
                    method  : 'scuttle_fleet',

                    params  : [{
                        session_id      : Lacuna.getSession(),
                        building_id     : vBuilding.id,
                        fleet_id        : fleetId,
                        quantity        : fleetQty
                    }],
                    success: function(o) {
                        scope.viewAllFleets(vBuilding, url);
                    }
                });
            });
            // click on 'recall' button submits the request
            $fleet_view_details.on('click', '.fleet_recall_button', function(event) {
                var $this       = $(this);
                var $parent     = $this.parent();
                var fleetId     = $parent.children().first().val();
                var fleetQty    = $parent.children('.fleet_recall_quantity').first().val();
                Lacuna.send({
                    module  : url,
                    method  : 'recall_fleet',

                    params  : [{
                        session_id      : Lacuna.getSession(),
                        building_id     : vBuilding.id,
                        fleet_id        : fleetId,
                        quantity        : fleetQty
                    }],
                    success: function(o) {
                        scope.viewAllFleets(vBuilding, url);
                    }
                });
            });

        };
    }

    return new SpacePort();
});
