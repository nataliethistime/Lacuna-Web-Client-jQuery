define(['jquery', 'lacuna', 'template', 'zebra_cookie'], function($, lacuna, template) {

    template.load('login');
    var empireName = $.cookie.read('lacuna-expanse-empire-name') || '';
    var empirePassword;

    function Login() {
        // Helper for jQuery's weird scope management.
        var scope = this;
        var panel;

        this.build = function() {

            // Build the Login Panel.
            panel = lacuna.Panel.newTabbedPanel({
                name: 'Welcome', // Could someone please come up with something more creative?
                tabs: [
                    {
                        name        : 'Login',
                        content     : template.read.login_main_tab({
                            empire_name : empireName
                        })
                    },
                    {
                        name: 'Create Empire',
                        content: template.read.login_create_empire_tab({

                        })
                    },
                    {
                        name: 'Forgot Password?',
                        content: template.read.login_forgot_password_tab({
                            
                        })
                    }
                ]
            });

            // Add the login event handlers.
            $('#empire, #password').keydown(function(event) {
                // Check if the 'enter' key was hit.
                if (event.which === 13) {
                    scope.login();
                }
            });

            $('#loginButton').click(this.login);
        };

        this.login = function() {
            empireName = $('#empire').val();
            var empirePassword = $('#password').val();

            lacuna.showPulser();

            lacuna.send({
                module: '/empire',
                method: 'login',

                params: [
                    empireName,
                    empirePassword,
                    'anonymous'                     // API Key
                ],

                success: function(o) {
                    lacuna.hidePulser();

                    lacuna.setSession(o.result.session_id);

                    // Pop the session and empire name into a cookie.
                    // Unused as yet, any volunteers for implementing logging in from Cookie?
                    //$.cookie.write('lacuna-expanse-session-id', lacuna.getSession(), 2 * 60 * 60); // 2 hour session.
                    if ($('#rememberEmpire').prop('checked')) {
                        $.cookie.write('lacuna-expanse-empire-name', empireName, 365 * 24 * 60 * 60); // 1 year.
                    }
                    else {
                        $.cookie.destroy('lacuna-expanse-empire-name');
                    }
                    // This kicks things off for the first time. The response is monitored in lacuna.js
                    // and callbacks are made to update the planet view and menus
                    lacuna.send({
                        module  : '/body',
                        method  : 'get_status',
                        params  : [
                            o.result.session_id,
                            o.result.status.empire.home_planet_id,
                        ],
                        success: function() {
                            panel.close();
                        }
                    });
                },
                scope: this
            });
        }
    }

    return new Login();
});
