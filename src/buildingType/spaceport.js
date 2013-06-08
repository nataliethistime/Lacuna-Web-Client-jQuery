define(['jquery', 'lacuna', 'template', 'body'], function($, Lacuna, Template, Body) {
    
    Template.load('building/spacePort');

    function SpacePort() {
        var scope = this;

        scope.getTabs = function() {
            //console.log(Body);
            return [
                {
                    name    : 'Travelling',
                    content : Template.read.building_space_port_view_item({
                            assetsUrl   : window.assetsUrl
                        })
                    // This will be using a lot of the Body module.
                }
            ];
        };
    }

    return new SpacePort();
});
