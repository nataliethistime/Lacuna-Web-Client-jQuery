define(['jquery', 'lacuna', 'mapPlanet', 'login'], function($, Lacuna, MapPlanet, Login) {
    function Game() {

        this.buildMainScreen = function() {
            $('#lacuna').html($.Lacuna.templates.tmpl_game_main_screen({
                assetsUrl       : window.assetsUrl
            }));

            // Now for the fun stuff.
            MapPlanet.renderPlanet(Lacuna.GameData.Status.empire.home_planet_id);

            // Bottom menu
            $('#planets').html($.Lacuna.templates.tmpl_game_menu_planet({
                assetsUrl       : window.assetsUrl,
                planet_image    : $.Lacuna.GameData.Body.image,
                planet_name     : $.Lacuna.GameData.Body.id,
            }));
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
            Login.build();
        };
    }
    
    return new Game();
});
