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

                    deferred.done(function(o) {
                        // Remove the session cookie.
                        $.cookie.destroy('lacuna-expanse-session');
                            
                        // Delete all the status data to avoid "confusion."
                        Empire.destroy();
                        Body.destroy(); 

                        // Kill everything in the queue.
                        Queue.killall();

                        // Hide everything.
                        $('#gameHeader, #gameFooter, #buildingsParent, #menu_to_starmap, #menu_to_planetmap, #starsParent')
                            .css('visibility', 'hidden');

                        // I think it feels nice to use the last planet surface
                        // as the login background instead of the star field. :)
                        // If you disagree, uncomment this line, last I cared,
                        // it worked as it should.
                        //Body.backgroundCallbacks.fire('');
                    });
                }
            });
        };

        // What to do when the 'body' details change.
        // This is for the planet information at the bottom of the screen, 
         // *NOT* for the  body block of the status data. That's different.
        // Gets called via callback when new body data is brought in.
        scope.updateBody = function(o) {
            var status = o.result.status || o.result,
                body   = status.body
            ;

            if (body) {
                $('#planets').html(Template.read.game_menu_planet({
                    assetsUrl       : window.assetsUrl,
                    planet_image    : body.image,
                    planet_name     : body.name
                }));
            }

            // In here we will populate the (basic) planet list.
        };

        Lacuna.callbacks.add(scope.updateBody);
    }

    return new Menu();
});
