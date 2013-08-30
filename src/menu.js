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
                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/star_system/field.png')");
                    
                    // Fire the callbacks to redisplay the planet image
                    Body.backgroundCallbacks.fire('');
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

                    // I would like to put all this code inside a Game.logout
                    // kind of function, but that would make a circular dependency.
                    deferred.done(function(o) {
                        if (o.result) {
                            Lacuna.clearData();
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

            if (!newBody) {
                return;
            }

            $('#planets').html(Template.read.game_menu_planet({
               assetsUrl       : window.assetsUrl,
                planet_image    : newStatus.body.image,
                planet_name     : newStatus.body.name
            }));
                
            // TODO: populate the planet list at the bottom of the screen.
        };

        Lacuna.callbacks.add(scope.updateBody);
    }

    return new Menu();
});
