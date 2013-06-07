define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    function DefaultBuilding() {
        this.getTabs = function() {
            return [];
        };
    }

    return new DefaultBuilding();
});
