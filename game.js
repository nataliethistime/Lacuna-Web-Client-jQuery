define(['jquery', 'lacuna', 'mapPlanet', 'template', 'empire'], function($, Lacuna, MapPlanet, Template, Empire) {
    function Game() {

        Template.load(['game']);

        this.buildMainScreen = function() {

            $('#lacuna').html(Template.read.game_main_screen({
                assetsUrl       : window.assetsUrl
            }));

            // Now for the fun stuff.
            MapPlanet.renderPlanet(Empire.get.home_planet_id);
         };

        this.start = function() {
            Lacuna.Panel.panelWidth = 800 /*px*/;

            // A Panel's height can be decided manually or left up to jQuery.
            var url = window.location.protocol +
                '//' + window.location.hostname + window.location.pathname +
                'resources.json';
            
            $.getJSON(url, function(json) {
                Lacuna.Resources = json;
            });
            
            // Open the login screen.
            require(['login'], function(Login) {
                Login.build();
            });
        };
    }
    
    return new Game();
});

