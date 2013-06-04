define(['jquery', 'lacuna', 'mapPlanet', 'login', 'template', 'queue'], function($, Lacuna, MapPlanet, Login, Template, Queue) {
    function Game() {

        Template.load(['game']);

        this.start = function() {
            Lacuna.Panel.panelWidth = 800; // pixels 

            // A Panel's height can be decided manually or left up to jQuery.
            var url = window.location.protocol 
                + '//' 
                + window.location.hostname
                + window.location.pathname;

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

            require(['menu'], function(Menu) {
                Menu.renderMenu();
            });

            // This creates the planet map and stars view divisions
            // but they are initially hidden and are populated by callbacks
            MapPlanet.renderPlanet();

            // Open the login screen.
            Login.build();

            // Start the main loop, which is used later.
            Queue.start();
        };
    }
    
    return new Game();
});

