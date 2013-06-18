define(['jquery', 'lacuna', 'library', 'template', 'body'], function($, Lacuna, Library, Template, Body) {
    
    Template.load(['building/spacePort','widgets/fleet_controls']);

    function SpacePort() {
        var scope = this;

        // Get the various tabs
        scope.getTabs = function(vBuilding, url) {
            return [
                {
                    name    : 'Fleets',
                    content : Template.read.building_space_port_view_tab({}),
                    select  : function(e) {
                        scope.viewAllFleets(vBuilding, url);
                    }
                },
                {
                    name    : 'Send',
                    content : Template.read.building_space_port_send_tab({
                        widget_fleet_send   : Template.read.widget_fleet_send({})
                    }),
                    select  : function(e) {
                        scope.addEvents(vBuilding, url);
                    }
                },
                {
                    name    : 'Foreign',
                    content : Template.read.building_space_port_foreign_tab({}),
                    select  : function(e) {
                        scope.addEvents(vBuilding, url);
                    }
                }
            ];
        };

        // request view_all_fleets and update the tab with the result
        scope.viewAllFleets = function(vBuilding, url) {
            var deferredViewAllFleets = Lacuna.send({
                module  : url,
                method  : 'view_all_fleets',
                params  : [{
                    session_id      : Lacuna.getSession(),
                    building_id     : vBuilding.id
                }]
            });
        
            deferredViewAllFleets.done(function(o) {
                var content = [];

                if (o.result.number_of_fleets <= 0) {
                    content.push(Template.read.building_space_port_no_fleets({}));
                }
                else {
                    content.push(Template.read.building_space_port_view_toolbar({}));
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
            });
        };

        // **** Event handlers ****
        
        // Click on a fleet name, allows it to be renamed
        scope.eventFleetRename = function(e) {
            var $this = $(this);
            $this.addClass('hidden');
            $this.next().removeClass('hidden');
        };
        // Cancel a fleet rename.
        scope.eventFleetRenameCancel = function(e) {
            var $this = $(this);
            var $parent = $this.parent();
            $parent.prev().removeClass('hidden');
            $parent.addClass('hidden');
        };
        // Confirm a fleet rename.
        scope.eventFleetRenameConfirm = function(e) {
            var $this = $(this);
            var $parent = $this.parent();
            $parent.prev().removeClass('hidden');
            $parent.addClass('hidden');
            var fleetId     = $parent.parent().children().first().val();
            var fleetName   = $parent.children('.fleet_new_name').first().val();
            var fleetQty    = $parent.children('.fleet_rename_quantity').first().val();
            var deferredRenameFleet = Lacuna.send({
                module  : e.data.url,
                method  : 'rename_fleet',
                params  : [{
                    session_id      : Lacuna.getSession(),
                    building_id     : e.data.vBuilding.id,
                    fleet_id        : fleetId,
                    name            : fleetName,
                    quantity        : fleetQty
                }]
            });
            deferredRenameFleet.done(function(o) {
                scope.viewAllFleets(e.data.vBuilding, e.data.url);
            });
            deferredRenameFleet.always(function(status) {
                // re-enable the event handler
                e.data.domObj.one('click', '.fleet_name_rename_button', {
                    vBuilding   : e.data.vBuilding,
                    url         : e.data.url,
                    domObj      : e.data.domObj
                    }, scope.eventFleetRenameConfirm
                );
            });    
        };
        // Scuttle a number of ships from a fleet
        scope.eventFleetScuttle = function(e) {
            var $this       = $(this);
            var $parent     = $this.parent();
            var fleetId     = $parent.children().first().val();
            var fleetQty    = $parent.children('.fleet_scuttle_quantity').first().val();
            var deferredScuttleFleet = Lacuna.send({
                module  : e.data.url,
                method  : 'scuttle_fleet',
                params  : [{
                    session_id      : Lacuna.getSession(),
                    building_id     : e.data.vBuilding.id,
                    fleet_id        : fleetId,
                    quantity        : fleetQty
                }]
            });

            deferredScuttleFleet.done(function(o) {
                scope.viewAllFleets(e.data.vBuilding, e.data.url);
            });
            deferredScuttleFleet.always(function(status) {
                // re-enable the event handler
                e.data.domObj.one('click', '.fleet_scuttle_button', {
                    vBuilding   : e.data.vBuilding,
                    url         : e.data.url,
                    domObj      : e.data.domObj
                    }, scope.eventFleetScuttle
                );
            });
        };
        // Recall a number of ships from a fleet
        scope.eventFleetRecall = function(e) {
            var $this       = $(this);
            var $parent     = $this.parent();
            var fleetId     = $parent.children().first().val();
            var fleetQty    = $parent.children('.fleet_recall_quantity').first().val();
            var deferredRecallFleet = Lacuna.send({
                module  : e.data.url,
                method  : 'recall_fleet',
                params  : [{
                    session_id      : Lacuna.getSession(),
                    building_id     : e.data.vBuilding.id,
                    fleet_id        : fleetId,
                    quantity        : fleetQty
                }]
            });
            deferredRecallFleet.done(function(o) {
                scope.viewAllFleets(e.data.vBuilding, e.data.url);
            });
            deferredRecallFleet.always(function(status) {
                // re-enable the event handler
                e.data.domObj.one('click', '.fleet_recall_button', {
                    vBuilding   : e.data.vBuilding,
                    url         : e.data.url,
                    domObj      : e.data.domObj
                    }, scope.eventFleetRecall
                );
            });
        };
        // Get available fleets for a target.
        scope.eventGetAvailableFleet = function(e) {
            var targetType = $('#send_fleet_target_type :selected').val();
            var target = {};
            if (targetType === 'xy') {
                target = {
                    x   : $('#send_fleet_target_x').val(),
                    y   : $('#send_fleet_target_y').val()
                };
            }
            else {
                target[targetType] = $('#send_fleet_target_text').val();
            }
    
            var deferredViewAvailableFleets = Lacuna.send({
                module  : e.data.url,
                method  : 'view_available_fleets',
                params  : [{
                    session_id      : Lacuna.getSession(),
                    body_id         : e.data.vBuilding.body_id,
                    target          : target
//                  filter          : {},
//                  sort            : {}
                }]
            });

            deferredViewAvailableFleets.done(function(o) {
                var content = [];
                if (! o.result.available || o.result.available.length <= 0) {
                    content.push(Template.read.building_space_port_no_available_fleets({}));
                }
                else {
                    content.push(Template.read.building_space_port_view_toolbar({}));
                    _.each(o.result.available, function(fleet) {
                        content.push(Template.read.building_space_port_view_item({
                            assetsUrl   : window.assetsUrl,
                            fleet       : fleet,
                            Library     : Library
                        }));
                    });
                }
                $("#fleet_send_details").html(content.join(''));
            });
            deferredViewAvailableFleets.fail(function(error) {
                $("#fleet_send_details").html(error.message);
            });
            deferredViewAvailableFleets.always(function(status) {
                e.data.domObj.one('click', '#send_available_fleet_button', {
                    vBuilding   : e.data.vBuilding,
                    url         : e.data.url,
                    domObj      : e.data.domObj
                    }, scope.eventGetAvailableFleet
                );
            });
        };

        scope.eventsAdded = 0;

        scope.addEvents = function(vBuilding, url) {
            // Make sure we only add them once.
            if (scope.eventsAdded) {
                return;
            }
            // Add event handlers for the Space Port. Let them bubble up to the div holding the tabs
            var $tab_parent = $('#fleet_view_details').parents('.ui-tabs').first();

            $tab_parent.on('click', '.fleet_name', scope.eventFleetRename);

            $tab_parent.on('click', '.fleet_name_cancel_button', scope.eventFleetRenameCancel);

            $tab_parent.one('click', '.fleet_name_rename_button', {
                vBuilding   : vBuilding, 
                url         : url, 
                domObj      : $tab_parent 
                }, scope.eventFleetRenameConfirm);

            $tab_parent.one('click', '.fleet_scuttle_button', {
                vBuilding   : vBuilding, 
                url         : url, 
                domObj      : $tab_parent 
                }, scope.eventFleetScuttle);

            $tab_parent.one('click', '.fleet_recall_button', {
                vBuilding   : vBuilding, 
                url         : url, 
                domObj      : $tab_parent 
                }, scope.eventFleetRecall);

            $tab_parent.one('click', '#send_available_fleet_button', {
                vBuilding   : vBuilding, 
                url         : url,
                domObj      : $tab_parent
                }, scope.eventGetAvailableFleet);

            $tab_parent.on('change', '#send_fleet_target_type', function(e) {
                    var $this = $(this);
                    if ($this.val() === 'xy') {
                        $('#send_fleet_select_xy').removeClass('hidden');
                        $('#send_fleet_select_text').addClass('hidden');
                    }
                    else {
                        $('#send_fleet_select_xy').addClass('hidden');
                        $('#send_fleet_select_text').removeClass('hidden');
                    }
                }
            );
 
            scope.eventsAdded = 1;
        };
    }

    return new SpacePort();
});
