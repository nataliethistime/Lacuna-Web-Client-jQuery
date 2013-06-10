define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    function DefaultBuilding() {
        var scope = this;
        scope.getTabs = function() {
            return [];
        };
        scope.addEvents = function(vBuilding, url) {
        };
    }

    return new DefaultBuilding();
});
