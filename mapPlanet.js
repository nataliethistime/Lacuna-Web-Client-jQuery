define(['jquery', 'lacuna', 'library', 'building', 'buildings', 'template'], function($, Lacuna, Library, Building, Buildings, Template) {
    function MapPlanet() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        // Cache for the buildings rendered on the planet.
        this.buildings = {};

        // Cache for all the build timers that are set.
        this.intervals = {};

        Template.load(['mapPlanet']);

        this.renderPlanet = function(id) {
            var buildingsTemplate = [];

            // So that this method can be treated as an 'update planet view'.
            id = id || Lacuna.GameData.Status.body.id;
            var body = Lacuna.GameData.Status.body;

            $('#buildingsParent').off('click mouseenter mouseleave'); // Remove event listeners.
            $('#buildingsParent').fadeOut(500, function() { // Fade out planet surface.

                for (var x = -5; x < 6; x++) {
                    for (var y = -5; y < 6; y++) {
                        var idStr       = Buildings.get_idStr(x,y),
                            idStrCenter = idStr + '_center'
                        ;
                        buildingsTemplate[buildingsTemplate.length] = Template.read.game_mapPlanet_plot({
                            assetsUrl       : window.assetsUrl,
                            idStr           : idStr,
                            idStrCenter     : idStrCenter,
                            x               : x,
                            y               : y,
                            size            : 100
                        });

                        // Mouse over effects.
                        $('#buildingsParent').on({
                            mouseenter: function(e) {
                                // Display the pretty border.
                                $('#' + e.data.borderEl).css({
                                    'border-style': 'dashed',
                                    'border-color': 'white',
                                    'border-width': '2px',
                                    'margin': '0px' // Stop the images jumping around.
                                });
                                // Then the level/build number/image.
                                $('#' + e.data.centerEl).css('display', '');
                            },
                            mouseleave: function(e) {
                                // Hide the border.
                                $('#' + e.data.borderEl).css({
                                    'border-style': '',
                                    'border-color': '',
                                    'border-width': '',
                                    'margin': '2px' // Stop the images jumping around.
                                });
                                // Then the level/build number/image.
                                $('#' + e.data.centerEl).css('display', 'none');
                            },
                            click: function(e) {
                                // This bit is rather fun. If there's an item
                                // in the this.buildings object that matches
                                // the selected plot, then the building view
                                // panel will be opened. Otherwise, the plot
                                // will be assumed empty, and the build panel
                                // will be opened.
                                if (scope.buildings[e.data.borderEl]) {
                                    // Open view panel.
                                    Building.view(scope.buildings[e.data.borderEl]);
                                } else {
                                    // Open build panel.
                                    // TODO
                                }
                            }
                        }, '#' + idStr, {
                            borderEl: idStr,
                            centerEl: idStrCenter
                        });

                        // What to do if the building changes
                        Buildings.callback_add(x, y, function(building) {
                            var idStr           = building.idStr,
                                el              = $('#' + idStr),
                                idStrCenter     = idStr + '_center',
                                idStrCounter    = idStr + '_counter'
                            ;

                            el.css('background', 'url(\'' + window.assetsUrl + '/planet_side/100/' + building.image + '.png\') no-repeat transparent');
                            el.html(Template.read.game_mapPlanet_building_level({
                                pending_build   : building.pending_build,
                                idStrCounter    : idStrCounter,
                                idStrCenter     : idStrCenter,
                                building_level  : building.level
                            }));

                            scope.buildings[idStr] = building;
                            // Clearing a build timer, only to reset it, is not ideal, but it's pragmatic.
                            scope.clearBuildTimer(idStrCounter);
                            if (building.pending_build) {
                                scope.createBuildTimer(idStrCounter, building.pending_build.seconds_remaining);
                            }
                        });

                    }
                }
 
                // Send it to the DOM.
                $('#buildingsParent').html([
                    '<div id="buildingsDraggableChild">',
                    buildingsTemplate.join(''),
                    '</div>'].join('')
                );
 
                Buildings.get_buildings(id);

                // I'd like this to be some sort of fade, one day..
                if (body) {
                    $('#lacuna').css('background-image', 'url(\'' + window.assetsUrl + '/planet_side/' + body.surface_image + '.jpg\')');
                }
 
                // Center the view.
                var parent  = $('#lacuna'), // Basically, the height of the screen.
                    height  = parent.height(),
                    width   = parent.width()
                ;

                $('#buildingsDraggableChild').css({
                    top     : (height / 2) - 550,
                    left    : (width / 2) - 550
                });

                // Start the Draggable.
                $('#buildingsDraggableChild').draggable();

                // Now that everything is ready, fade it all in!
                setTimeout(function() { // Wait for the DOM to update.
                    $('#buildingsParent').fadeIn(500);
                }, 20);

                // Bottom menu
                $('#planets').html(Template.read.game_menu_planet({
                    assetsUrl       : window.assetsUrl,
                    planet_image    : 'p13',
                    planet_name     : 'planet'
                }));
            });
        };

        // Then a few helper functions to make things work.
        // All of the build timer stuff needs to get moved to library.js, sometime.
        this.createBuildTimer = function(targetEl, seconds) {
            var formattedTime = Library.formatTime(seconds);
            
            // This is faster than jQuery.
            document.getElementById(targetEl).innerHTML = formattedTime;
            var interval = setInterval(function() {
                seconds--;
                if (seconds === 0) {
                    // Remove the timer.
                    clearInterval(interval);
                    // Remove the interval from the log.
                    delete scope.intervals[interval];
                    document.getElementById(targetEl).innerHTML = '';
                } else {
                    formattedTime = Library.formatTime(seconds);
                    // This is faster than jQuery.
                    document.getElementById(targetEl).innerHTML = formattedTime;
                }
            }, 1000);
            
            // Log the interval. For later destruction.
            scope.intervals[targetEl] = interval;
        };

        this.clearBuildTimer = function(targetEl) {
            var interval = scope.intervals[targetEl];
            if (null != interval) {
                clearInterval(interval);
                delete scope.intervals[targetEl];
            }
        };

        this.clearAllBuildTimers = function() {
            var targetEls = Object.keys(scope.intervals);
            for (var i = 0; i < targetEls.length; i++) {
                scope.clearBuildTimer(targetEls[i]);
            }
        };
    }

    return new MapPlanet();
});
