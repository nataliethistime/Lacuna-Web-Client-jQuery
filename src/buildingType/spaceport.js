define(['jquery', 'lacuna', 'library', 'template', 'body'], function($, Lacuna, Library, Template, Body) {
    
    Template.load('building/spacePort');

    function SpacePort() {
        var scope = this;

        scope.getTabs = function(vBuilding, url) {
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

            return [
                {
                    name    : 'Fleets',
                    content : Template.read.building_space_port_view_list({})
                }
            ];
        };
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
            });


            // Add event handlers for scuttling ships

            // Add event handlers for recalling ships

        };
    }

    return new SpacePort();
});
