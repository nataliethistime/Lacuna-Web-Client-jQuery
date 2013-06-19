define(['jquery', 'template', 'zebra_cookie', 'mapStars', 'panel', 'lacuna', 'empire', 'text!templates/login.tmpl'],
function($, Template, Z, MapStars, Panel, Lacuna, Empire, TmplLogin) {

    Template.loadStrings(TmplLogin);
    var empireName = $.cookie.read('lacuna-expanse-empire-name') || '';
    var empirePassword;

    function Login() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        scope.start = function() {
            var session_id = $.cookie.read('lacuna-expanse-session');
            if (session_id) {
                scope.loginFromSessionCookie(session_id);
            }
            else {
                scope.buildPanel();
            }
        };

        scope.loginFromSessionCookie = function(session_id) {
            Lacuna.send({
                module: '/empire',
                method: 'get_status',

                params: [
                    session_id
                ],

                success: function(o) {
                    Lacuna.setSession(session_id);

                    scope.loginSuccess();
                },
                scope: this
            });
        };

        scope.buildPanel = function() {

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

        scope.login = function() {
            empireName      = $('#empire').val();

            // TODO: Re-enable this before we go live!
            empirePassword  = 'secret56';
//            empirePassword  = $('#password').val();            empirePassword  = $('#password').val();

            var deferredLogin = Lacuna.send({
                module  : '/empire',
                method  : 'login',
                params  : [{
                    'name'      : empireName,
                    'password'  : empirePassword,
                    'api_key'   : 'anonymous'
                }]
            });

            deferredLogin.done(function(o) {
                Lacuna.setSession(o.result.session_id);

                // Pop the empire name into a cookie.
                if ($('#rememberEmpire').prop('checked')) {
                    $.cookie.write('lacuna-expanse-empire-name', empireName, 365 * 24 * 60 * 60); // 1 year.
                }
                else {
                    $.cookie.destroy('lacuna-expanse-empire-name');
                }
                scope.loginSuccess();
            });
                    
        };
        
        scope.loginSuccess = function() {
            // This kicks things off for the first time. The response is monitored in lacuna.js
            // and callbacks are made to update the planet view and menus
            var deferredGetStatus = Lacuna.send({
                module  : '/body',
                method  : 'get_status',
                params  : [{
                    'session_id'    : Lacuna.getSession(),
                    'body_id'       : Lacuna.status.empire.home_planet_id
                }]
            });
            deferredGetStatus.done(function() {
                scope.panel.close();
                // Log in to the planet view
                $('#gameHeader, #gameFooter, #buildingsParent').css('visibility', 'visible');
                $('#starsParent').css('visibility', 'hidden');
            });
        };
    }

    return new Login();
});

