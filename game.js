define(['jquery', 'lacuna', 'mapPlanet', 'login', 'template'], function($, Lacuna, MapPlanet, Login, Template) {
    function Game() {

        Template.load(['game']);

        this.buildMainScreen = function() {

            // I am adding this back because I presume there is a problem loading Lacuna before Game?
            $('#lacuna').html([
                '<div id="mainScreen">',
                ' <div id="gameHeader" style="background-image: url(\'', window.assetsUrl, '/ui/web/bar_top_back.png\')">',
                ' ', //TODO
            ' </div>',
                ' <div id="buildingsParent" style="',
                'cursor: url(\'' + window.assetsUrl + '/ui/web/openhand.cur\'), default;',
                '">',
                ' </div>',
                ' <div id="gameFooter" style="background-image: url(\'', window.assetsUrl, '/ui/web/bar_bottom_back.png\')">',
                ' ', //TODO
            ' </div>',
                '</div>'].join(''));

//            $('#Lacuna').html(Template.read.game_main_screen({
//                assetsUrl       : window.assetsUrl
//            }));

            // Now for the fun stuff.
            MapPlanet.renderPlanet(Lacuna.GameData.Status.empire.home_planet_id);

//            // Bottom menu
//            $('#planets').html(Template.read.game_menu_planet({
//                assetsUrl       : window.assetsUrl,
//                planet_image    : Lacuna.GameData.Body.image,
//                planet_name     : Lacuna.GameData.Body.id,
//            }));
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
