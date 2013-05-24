define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    Template.load('building/shipyard');

    function Shipyard() {
        var scope = this;
        console.log(this);

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
            
        }
    }

    return new Shipyard();
});
