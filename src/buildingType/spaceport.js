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
                    $("#fleetViewDetails").html(content.join(''));
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
        };
    }

    return new SpacePort();
});
