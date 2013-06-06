// CIRCULAR DEPENDENCIES
// Do not assign dependencies 'lacuna', 'empire' to function arguments
// Always access these objects via require("class")
// e.g. require("lacuna").send()
// Do not use asynchronous require([]) form
//
define(['jquery', 'template', 'zebra_cookie', 'mapStars', 'panel', 'lacuna', 'empire'],
function($, Template, Z, MapStars, Panel) {

    Template.load(['login']);
    var empireName = $.cookie.read('lacuna-expanse-empire-name') || '';
    var empirePassword;

    function Login() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        this.start = function() {
            var session_id = $.cookie.read('lacuna-expanse-session');
            if (session_id) {
                scope.loginFromSessionCookie(session_id);
            }
            else {
                scope.buildPanel();
            }
        };

        this.loginFromSessionCookie = function(session_id) {
            require("lacuna").send({
                module: '/empire',
                method: 'get_status',

                params: [
                    session_id
                ],

                success: function(o) {
                    require("lacuna").hidePulser();

                    require("lacuna").setSession(session_id);

                    scope.loginSuccess();
                },
                scope: this
            });
        }

        this.buildPanel = function() {

            // Build the Login Panel.
            scope.panel = Panel.newTabbedPanel({
                name: 'Welcome', // Could someone please come up with something more creative?
                tabs: [
                    {
                        name        : 'Login',
                        content     : Template.read.login_main_tab({
                            empire_name : empireName
                        })
                    },
                    {
                        name: 'Create Empire',
                        content: Template.read.login_create_empire_tab({

                        })
                    },
                    {
                        name: 'Forgot Password?',
                        content: Template.read.login_forgot_password_tab({
                            
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

            $('#loginButton').click(scope.login);
        };

        this.login = function() {
            empireName      = $('#empire').val();
            empirePassword  = $('#password').val();

            require("lacuna").send({
                module: '/empire',
                method: 'login',

                params: [
                    empireName,
                    empirePassword,
                    'anonymous' // API Key
                ],

                success: function(o) {
                    require("lacuna").hidePulser();

                    require("lacuna").setSession(o.result.session_id);

                    // Pop the empire name into a cookie.
                    if ($('#rememberEmpire').prop('checked')) {
                        $.cookie.write('lacuna-expanse-empire-name', empireName, 365 * 24 * 60 * 60); // 1 year.
                    }
                    else {
                        $.cookie.destroy('lacuna-expanse-empire-name');
                    }
                    
                    // Store login session in session cookie
                    $.cookie.write('lacuna-expanse-session', o.result.session_id);
                    
                    scope.panel.close();
                    scope.loginSuccess();
                },
                scope: this
            });
        };
        
        this.loginSuccess = function() {
            // This kicks things off for the first time. The response is monitored in lacuna.js
            // and callbacks are made to update the planet view and menus
            require("lacuna").send({
                module  : '/body',
                method  : 'get_status',
                params  : [
                    require("lacuna").getSession(),
                    require("empire").get.home_planet_id
                ],
                success: function() {
                    // Log in to the planet view
                    $('#gameHeader, #gameFooter, #buildingsParent').css('visibility', 'visible');
                    $('#starsParent').css('visibility', 'hidden');
                }
            });
        };
    }

    return new Login();
});
