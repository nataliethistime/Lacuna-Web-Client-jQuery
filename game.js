define(['jquery', 'lacuna', 'mapPlanet', 'mapStars', 'template'], function($, lacuna, mapPlanet, mapStars, template) {
    function Game() {

        template.load(['game']);

        this.start = function() {
            lacuna.Panel.panelWidth = 800 /*px*/;

            // A Panel's height can be decided manually or left up to jQuery.
            var url = window.location.protocol +
                '//' + window.location.hostname + window.location.pathname +
                'resources.json';
            
            $.getJSON(url, function(json) {
                lacuna.Resources = json;
            });
            
            $('#lacuna').html(template.read.game_main_screen({
                assetsUrl       : window.assetsUrl
            }));

            // This creates the planet map and stars view divisions
            // but they are initially hidden and are populated by callbacks
            mapPlanet.renderPlanet();
            mapStars.renderStars();

            // Open the login screen.
            require(['login'], function(Login) {
                Login.build();
            });
        };
    }
    
    return new Game();
});

