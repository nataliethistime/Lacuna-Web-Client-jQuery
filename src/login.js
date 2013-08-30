define(['jquery', 'template', 'zebra_cookie', 'mapPlanet', 'panel', 'lacuna', 'empire', 'text!templates/login.tmpl', 'form_wizard'],
function($, Template, Z, MapPlanet, Panel, Lacuna, Empire, TmplLogin, FormWizard) {

    Template.loadStrings(TmplLogin);
    var empireName = $.cookie.read('lacuna-expanse-empire-name') || '';
    var empirePassword;

    function Login() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        scope.innit = function() {
            var sessionId = $.cookie.read('lacuna-expanse-session') || '';
            
            if (sessionId != '') {
                scope.loginFromSessionCookie(sessionId);
            }
            else {
                scope.buildPanel();
            }
        };

        scope.loginFromSessionCookie = function(sessionId) {
            var deferredStatus = Lacuna.send({
                module : '/empire',
                method : 'get_status',
                params : [
                    sessionId
                ]
            });

            deferredStatus.done(function(o) {
                Lacuna.setSession(sessionId);
                scope.loginSuccess();
            });
        };

        scope.buildPanel = function() {

            // This function is called when the session expires. If this happens
            // when the user was requesting a piece of the star map, it's most
            // likely that multiple requests are coming through. Meaning, the
            // session expired error was thrown multiple times. This should cure it.
            if (scope.panelBuilt) {
                return;
            }

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
                        name        : 'Create Empire',
                        content     : Template.read.login_create_empire_tab({
                            // TODO
                        }),
                        create      : scope.eventsCreateEmpireTab
                    },
                    {
                        name        : 'Forgot Password?',
                        content     : Template.read.login_forgot_password_tab({
                            // TODO
                        })
                    }
                ]
            });

            // Add the login event handlers for when the user hits the 'enter'
            // key on their keyboard.
            $('#empire, #password').keydown(function(event) {
                // Check if the 'enter' key was hit.
                if (event.which === 13) {
                    scope.login();
                }
            });

            // And for the standard hitting of the 'login' button.
            $('#loginButton').click(scope.login);

            scope.panelBuilt = true;
        };

        scope.refreshCaptch = function() {
            Recaptcha.reload();
        };

        scope.refreshCaptchaOld = function() {
            var deferredFetchCaptcha = Lacuna.send({
                module  : '/empire',
                method  : 'fetch_captcha',
                params  : [{}]
            });

            deferredFetchCaptcha.done(function(o) {
                $('#empireCaptchaImg').attr('src', o.result.url);
            });

        };

        scope.setSpecies = function(species) {
            $('#empireSpecies').val(species);
            var descriptions = {
                Average     : 'Not specializing in any area, but without any particular weaknesses.',
                Resilient   : 'Resilient and able to colonize most any planet.  Somewhat docile, but very quick learners and above average at producing any resource.',
                Warmonger   : 'Adept at ship building and espionage. They are bent on domination.',
                Viral       : 'Proficient at growing at the most expedient pace like a virus in the Expanse.',
                Trader      : 'Masters of commerce and ship building.'
            };
            var affinities = {
                Average     : [3,3,4,4,4,4,4,4,4,4,4,4,4],
                Resilient   : [2,7,3,3,3,5,5,5,5,5,1,1,3],
                Warmonger   : [4,5,4,7,2,4,2,2,7,2,7,1,5],
                Viral       : [1,7,1,4,7,7,1,1,1,1,7,1,7],
                Trader      : [2,3,5,4,7,7,1,1,7,1,1,7,2]
            };

            $('#empireSpeciesDesc').val(descriptions[species]);
            var levels = affinities[species];

            $('#speciesOrbits').slider("option","values",[levels[0],levels[1]]);
            $('#speciesManufacturing').slider("option","value",levels[2]);
            $('#speciesDeception').slider("option","value",levels[3]);
            $('#speciesResearch').slider("option","value",levels[4]);
            $('#speciesManagement').slider("option","value",levels[5]);
            $('#speciesFarming').slider("option","value",levels[6]);
            $('#speciesMining').slider("option","value",levels[7]);
            $('#speciesScience').slider("option","value",levels[8]);
            $('#speciesEnvironmental').slider("option","value",levels[9]);
            $('#speciesPolitical').slider("option","value",levels[10]);
            $('#speciesTrade').slider("option","value",levels[11]);
            $('#speciesGrowth').slider("option","value",levels[12]);
        };

        // Check if all the validations in step 0 pass
        scope.checkStep0Done = function() {
            if ($('#empireNameError').html() === '' && $('#empirePassError').html() === '' && $('#empirePassConfirmError').html() === '') {
                $('#step0Done').removeAttr('disabled');
            }
            else {
                $('#step0Done').attr('disabled', 'disabled');
            }
        };

        scope.eventsCreateEmpireTab = function() {
            Recaptcha.create(
                // We need to get this from the lacuna.conf file
                // TODO
                '6Lfw9-QSAAAAAETf38WvNE779Ye-8dp-p4cVNL7J',
                'empireReCaptcha',
                {
                    theme       : 'red',
                    callback    : Recaptcha.focus_response_field
                }
            );

            var displayNext = 0;
            // Whenever we update the empire name, check if the name is already taken
            $('#empireName').keyup(function() {
                var deferredEmpireName = Lacuna.send({
                    module  : '/empire',
                    method  : 'is_name_available',
                    params  : [{
                        'name'  : $('#empireName').val()
                    }],
                    error   : function(error) {
                        // do nothing (I don't like having to do this)
                    }
                });
                deferredEmpireName.fail(function(o) {
                    $('#empireNameError').html('Invalid Empire Name');
                });

                deferredEmpireName.done(function(o) {
                    $('#empireNameError').html('');
                });
                deferredEmpireName.always(function(o) {
                    scope.checkStep0Done();
                });
            });
            $('#empirePass').keyup(function() {
                var $ep = $('#empirePass');
                var error = '';
                if ($ep.val().length < 6) {
                    error = 'Must be at least 6 characters.';
                }
                $('#empirePassError').html(error);
                scope.checkStep0Done();
            });
            $('#empirePassConfirm').keyup(function() {
                var $ecp = $('#empirePassConfirm');
                var error = '';
                if ($('#empirePass').val() != $('#empirePassConfirm').val()) {
                    error = 'Passwords must match.';
                }
                $('#empirePassConfirmError').html(error);
                scope.checkStep0Done;
            });

            $.each(['#empireAgreeTOS','#empireAgreeRules'], function(index, value) {
                $(value).change(function() {
                    if ($(value).prop('checked')) {
                        $(value+'Error').html('');
                    }
                    else {
                        $(value+'Error').html('Required');
                    }
                });
            });


            $('#empireRefreshCaptcha').click(function() {
                scope.refreshCaptcha();
            });
            var species = ['Average','Resilient','Warmonger','Viral','Trader'];
            $.each(species, function(index, value) {
                $('#species'+value).click(function() {
                    scope.setSpecies(value);
                });
            });

            $('#empireCreateButton').click(scope.empire_create);
            $('#empireForm').formToWizard();
            $('.slider').slider({
                min         : 1,
                max         : 7
            });
            $('#speciesOrbits').slider("option","range",true);
            $('.slider').on("slidechange", function(e,ui) {
                var txt = ui.value;
                if (ui.values) {
                    txt = ui.values[0]+'-'+ui.values[1];
                }
                var v = this.previousElementSibling.children[0].innerHTML = txt;
                scope.update_species_points();
            });
            scope.update_species_points();
            scope.checkStep0Done();
        };

        scope.update_species_points = function() {
            var sliders = ['Orbits','Manufacturing','Deception','Research','Management','Farming','Mining','Science','Environmental','Political','Trade','Growth'];

            var sum = 0;
            $.each(sliders, function(index,value) {
                var $slider = $('#species'+value);
                if (value == 'Orbits') {
                    sum += ($slider.slider("values", 1) - $slider.slider("values", 0)) + 1;
                }
                else {
                    sum += $slider.slider("value");
                }
            });
            $('#slider_total_points').html('Total points '+sum+'/45');
            if (sum > 45 ) {
                $('#slider_total_points').addClass('danger');
            }
            else {
                $('#slider_total_points').removeClass('danger');
            }
        }

        scope.empire_create = function() {
            var deferredCreate = Lacuna.send({
                module  : '/empire',
                method  : 'create',
                params  : [{
                    'api_key'               : '24704aa1-73e4-4091-9c0d-724d3a098f36',
                    'name'                  : $('#empireName').val(),
                    'password'              : $('#empirePass').val(),
                    'password1'             : $('#empirePassConfirm').val(),
                    'email'                 : $('#empireEmail').val(),
                    'invite_code'           : $('#empireFriendCode').val(),
                    'captcha_challenge'     : $('#recaptcha_challenge_field').val(),
                    'captcha_response'      : $('#recaptcha_response_field').val(),
                    'species_name'          : $('#empireSpecies').val(),
                    'species_description'   : $('#empireSpeciesDesc').val(),
                    'species_min_orbit'     : $('#speciesOrbits').slider('values', 0),
                    'species_max_orbit'     : $('#speciesOrbits').slider('values', 1),
                    'species_manufacturing' : $('#speciesManufacturing').slider('value'),
                    'species_deception'     : $('#speciesDeception').slider('value'),
                    'species_research'      : $('#speciesResearch').slider('value'),
                    'species_management'    : $('#speciesManagement').slider('value'),
                    'species_farming'       : $('#speciesFarming').slider('value'),
                    'species_mining'        : $('#speciesMining').slider('value'),
                    'species_science'       : $('#speciesScience').slider('value'),
                    'species_environmental' : $('#speciesEnvironmental').slider('value'),
                    'species_political'     : $('#speciesPolitical').slider('value'),
                    'species_trade'         : $('#speciesTrade').slider('value'),
                    'species_growth'        : $('#speciesGrowth').slider('value')
                }]
            });
            deferredCreate.done(function(o) {
                alert('empire id='+o.result);
                scope.loginSuccess();
            });
                
        };

        scope.login = function() {
            empireName      = $('#empire').val();
            empirePassword  = Lacuna.debugMode ? 'secret56' : $('#password').val();

            var deferredLogin = Lacuna.send({
                module  : '/empire',
                method  : 'login',
                params  : [{
                    'name'      : empireName,
                    'password'  : empirePassword,
                    'api_key'   : 'anonymous' // Make sure to use a real one in release.
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
            console.log(require('empire').get);//debug
            console.log(require('body').get);//debug
            var deferredGetStatus = Lacuna.send({
                module  : '/body',
                method  : 'get_status',
                params  : [{
                    'session_id'    : Lacuna.getSession(),
                    // Fresh require() so that values are updated.
                    'body_id'       : require('empire').get.home_planet_id
                }]
            });
            
            deferredGetStatus.done(function(o) {
                // Need to make sure we don't attempt to close a panel that
                // isn't there. Which would happen in the case of logging in
                // from a session stored in a cookie.
                if (scope.panelBuilt) {
                    scope.panel.close();
                    scope.panelBuilt = false;
                }   

                // Log in to the planet view
                $('#gameHeader, #gameFooter, #buildingsParent, #menu_to_starmap').css('visibility', 'visible');
                $('#starsParent, #menu_to_planetmap').css('visibility', 'hidden');

                MapPlanet.showPlanet(require('empire').get.home_planet_id);
            });
        };
    }

    return new Login();
});

