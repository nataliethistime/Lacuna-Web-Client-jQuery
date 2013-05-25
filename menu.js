define(['jquery', 'lacuna', 'template', 'game', 'login'], function($, Lacuna, Template, Game, Login) {
    function Menu() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        this.renderMenu = function() {
            $('.logout.menuItem').on({
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
