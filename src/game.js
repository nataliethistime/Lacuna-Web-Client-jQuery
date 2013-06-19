define(['jquery', 'lacuna', 'mapPlanet', 'login', 'template', 'panel', 'menu', 'queue', 'text!templates/game.tmpl'],
function($, Lacuna, MapPlanet, Login, Template, Panel, Menu, Queue, TmplGame) {
    function Game() {

        Template.loadStrings(TmplGame);

        this.start = function() {
            Panel.panelWidth = 800; // pixels 

            var url = window.location.href;
            // Remove any tailing 'index.html' or similar
            var n = url.lastIndexOf('/') + 1;
            url = url.substring(0,n) + 'resources.json';
            
            $.getJSON(url, function(json) {
                Lacuna.Resources = json;
            });
            
            $('#lacuna').html(Template.read.game_main_screen({
                assetsUrl       : window.assetsUrl
            }));
            $('#gameHeader, #gameFooter, #buildingsParent, #starsParent')
                .css('visibility', 'hidden');

            Menu.renderMenu();

            // This creates the planet map and stars view divisions
            // but they are initially hidden and are populated by callbacks
            MapPlanet.renderPlanet();

            // Open the login screen.
            Login.start();

            // Start the main loop, which is used later.
            Queue.start();
        };
    }
    
    return new Game();
});

