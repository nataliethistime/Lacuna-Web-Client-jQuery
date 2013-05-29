define(['jquery', 'lacuna', 'template', 'login', 'mapStars', 'body'], function($, Lacuna, Template, Login, MapStars, Body) {
    function Menu() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        this.renderMenu = function() {
            $('#menu_to_starmap').on({
                click: function(e) {
                    $('#buildingsParent').css('visibility', 'hidden');
                    $('#starsParent').css('visibility', 'visible');
                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/ui/field.png')");
                    $('#menu_to_starmap').css('visibility', 'hidden');
                    $('#menu_to_planetmap').css('visibility', 'visible');
                    MapStars.renderStars();
                }
            });
            $('#menu_to_planetmap').on({
                click: function(e) {
                    $('#buildingsParent').css('visibility', 'visible');
                    $('#starsParent').css('visibility', 'hidden');
                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/ui/field.png')");
                    $('#menu_to_starmap').css('visibility', 'visible');
                    $('#menu_to_planetmap').css('visibility', 'hidden');
                    // Fire the callbacks to redisplay the planet image
                    Body.backgroundCallbackFire();
                }
            });
            $('#menu_logout').on({
                click: function(e) {
                    Lacuna.send({
                        module: '/empire',
                        method: 'logout',

                        params: [
                            Lacuna.getSession()
                        ],

                        success: function(o) {
                            Lacuna.hidePulser();
                            $('#gameHeader, #gameFooter, #buildingsParent, #starsParent')
                                .css('visibility', 'hidden');

                            // TODO: Clear the buildings data.
                            Login.build();
                        }
                    });
                }
            });
        };
    }

    return new Menu();
});
