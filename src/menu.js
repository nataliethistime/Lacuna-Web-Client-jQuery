define(['jquery', 'lacuna', 'template', 'login', 'mapPlanet', 'mapStars', 'body', 'queue', 'empire'], 
    function($, Lacuna, Template, Login, MapPlanet, MapStars, Body, Queue, Empire) {
    function Menu() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        scope.innit = function() {
            $('#menu_to_starmap').on({
                click: function(e) {
                    $('#buildingsParent , #menu_to_starmap')
                        .css('visibility', 'hidden');
                    
                    $('#starsParent, #menu_to_planetmap')
                        .css('visibility', 'visible');

                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/star_system/field.png')");
                    
                    MapStars.renderStars('');
                }
            });

            $('#menu_to_planetmap').on({
                click: function(e) {
                    $('#buildingsParent, #menu_to_starmap')
                        .css('visibility', 'visible');
                    $('#starsParent, #menu_to_planetmap')
                        .css('visibility', 'hidden');
                    $('#lacuna').css('background-image', Body.surface_image);
                }
            });
            
            $('#menu_logout').on({
                click: function(e) {
                    var deferred = Lacuna.send({
                        module  : '/empire',
                        method  : 'logout',
                        params  : [
                            Lacuna.getSession()
                        ]
                    });

                    deferred.done(function(o) {
                        if (o.result) {
                            Lacuna.clearData();
                            Login.buildPanel(); // fall back to the login screen.
                        }
                    });
                }
            });
        };

        // What to do when the 'body' details change.
        // This is for the planet information at the bottom of the screen, 
        // *NOT* for the  body block of the status data. That's different.
        // Gets called via callback when new body data is brought in.
        scope.updateBody = function(newStatus) {

            var newBody = newStatus.body;

            // We are always being passed a body block, just need to make sure
            // it has what we want in it.
            if (!newBody || !newBody.name || !newBody.image) {
                return;
            }

            $('#planets').html(Template.read.game_menu_planet({
               assetsUrl        : window.assetsUrl,
                planet_image    : newBody.image,
                planet_name     : newBody.name
            }));
                
            // TODO: populate the planet list at the bottom of the screen.
        };

        Lacuna.callbacks.add(scope.updateBody);
    }

    return new Menu();
});
