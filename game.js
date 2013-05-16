define(['jquery', 'lacuna', 'mapPlanet', 'mapStars', 'template'], function($, Lacuna, MapPlanet, MapStars, Template) {
    function Game() {

        Template.load(['game']);

        this.start = function() {
            Lacuna.Panel.panelWidth = 800 /*px*/;

            // A Panel's height can be decided manually or left up to jQuery.
            var url = window.location.protocol +
                '//' + window.location.hostname + window.location.pathname +
                'resources.json';
            
            $.getJSON(url, function(json) {
                Lacuna.Resources = json;
            });
            
            $('#lacuna').html(Template.read.game_main_screen({
                assetsUrl       : window.assetsUrl
            }));

            // This creates the planet map and stars view divisions
            // but they are initially hidden and are populated by callbacks
            MapPlanet.renderPlanet();
            MapStars.renderStars();

            // Open the login screen.
            require(['login'], function(Login) {
                Login.build();
            });
        };
    }
    
    return new Game();
});

