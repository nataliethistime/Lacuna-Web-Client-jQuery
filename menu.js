define(['jquery', 'lacuna', 'template', 'login', 'mapStars'], function($, Lacuna, Template, Login, MapStars) {
    function Menu() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        this.renderMenu = function() {
            $('#menu_change').on({
                click: function(e) {
                    $('#buildingsParent').css('visibility', 'hidden');
                    $('#starsParent').css('visibility', 'visible');
                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/ui/field.png')");
                    MapStars.renderStars();
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
