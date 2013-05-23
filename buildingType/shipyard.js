define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    Template.load('building/shipyard');

    function Shipyard() {
        this.getTabs = function() {
            return [
                {
                    name: 'Build Queue',
                    content: Template.read.building_shipyard_build_queue_tab()
                },
                {
                    name: 'Build Ships',
                    content: Template.read.building_shipyard_build_ship_tab()
                }
            ];
        };
    }

    return new Shipyard();
});
