define(['jquery', 'lacuna', 'template', 'game', 'login'], function($, Lacuna, Template, Game, Login) {
    function Menu() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        this.renderMenu = function() {
            $('#menu_change').on({
                click: function(e) {
                    $('#buildingsParent').css('visibility', 'hidden');
                    $('#starsParent').css('visibility', 'visible');
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
