define(['jquery', 'lacuna', 'mapPlanet', 'login', 'template', 'panel', 'menu', 'queue', 'text!templates/game.tmpl'],
function($, Lacuna, MapPlanet, Login, Template, Panel, Menu, Queue, TmplGame) {
    function Game() {

        Template.loadStrings(TmplGame);

        this.innit = function() {
            Panel.panelWidth = 800; // pixels

            // Get the resources.json file loaded.
            Lacuna.getResources();
            
            // Add in the HTML for the main game window.
            $('#lacuna').html(Template.read.game_main_screen({
                assetsUrl       : window.assetsUrl
            }));

            // Hide the UI elements not needed for the login screen.
            $('#gameHeader, #gameFooter')
                .css('visibility', 'hidden');

            Menu.innit();

            // Start the main loop, which is used later. I think that it's
            // easier to just run it throughout the existence of the client.
            Queue.start();
            
            // Open the login screen.
            Login.innit();
        };
    }
    
    return new Game();
});

