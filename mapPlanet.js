define(['jquery', 'lacuna', 'library', 'building', 'template'], function($, Lacuna, Library, Building, Template) {
    function MapPlanet() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        Template.load("mapPlanet");

        this.renderPlanet = function(id) {
            var buildingsTemplate = [];

            // So that this method can be treated as an 'update planet view'.
            id = id || Lacuna.GameData.Status.body.id;

            // Clean everything up.
            this.clearBuildTimers(); // Remove Build timers.
            $('#buildingsParent').off('click mouseenter mouseleave'); // Remove event listeners.
            $('#buildingsParent').fadeOut(500, function() { // Fade out planet surface.

                for (var x = -5; x < 6; x++) {
                    for (var y = -5; y < 6; y++) {
                        var idStr = 'plot_' + x + '_' + y,
                            idStrCenter = idStr + '_center';
                        buildingsTemplate[buildingsTemplate.length] = Template.read.game_mapPlanet_plot({
                            assetsUrl: window.assetsUrl,
                            idStr: idStr,
                            idStrCenter: idStrCenter,
                            x: x,
                            y: y,
                            size: 100
                        });

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
                                // in the this.buildings object thet matches
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
                    }
                }
 
                // Send it to the DOM.
                $('#buildingsParent').html([
                    '<div id="buildingsDraggableChild">',
                buildingsTemplate.join(''),
                    '</div>'].join(''));
 
                // Right, now that that's out of the way, onward we must go...
                Lacuna.send({
                    module: '/body',
                    method: 'get_buildings',
                    params: [
                        Lacuna.getSession(), // Session Id
                        id // Body Id
                    ],

                    success: function(o) {
                        var buildings = o.result.buildings,
                            body      = o.result.body;
                            keys      = Object.keys(buildings);
 
                        for (var i = 0; i < keys.length; i++) {
                            var buildingId = keys[i],
                                building = buildings[buildingId],
                                idStr = 'plot_' + building.x + '_' + building.y,
                                idStrCenter = idStr + '_center',
                                idStrCounter = idStr + '_counter',
                                el = $('#' + idStr);
 
                            // Add the Id into the building data.
                            building.id = buildingId;
 
                            // Woopsie! Long line alert!!
                            el.css('background', 'url(\'' + window.assetsUrl + '/planet_side/100/' + building.image + '.png\') no-repeat transparent');
                            el.attr('title', building.name);
                            el.html(Template.read.game_mapPlanet_building_level({
                                pending_build: building.pending_build,
                                idStrCounter: idStrCounter,
                                idStrCenter: idStrCenter,
                                building_level: building.level
                            }));
 
                            // Set up the build timer.
                            if (building.pending_build) {
                                scope.createBuildTimer(building.pending_build.seconds_remaining, idStrCounter);
                            }
 
                            // Check out the click handling of each tile above.
                            scope.buildings[idStr] = building;
                        }
 
                        // I'd like this to be some sort of fade, one day..
                        $('#lacuna').css('background-image', 'url(\'' + window.assetsUrl + '/planet_side/' + body.surface_image + '.jpg\')');
 
                        // Center the view.
                        var parent = $('#lacuna'), // Basically, the height of the screen.
                            height = parent.height(),
                            width = parent.width();
                        $('#buildingsDraggableChild').css({
                            top: (height / 2) - 550,
                            left: (width / 2) - 550
                        });

                        // Start the Draggable.
                        $('#buildingsDraggableChild').draggable();

                        // Now that everything is ready, fade it all in!
                        setTimeout(function() { // Wait for the DOM to update.
                            $('#buildingsParent').fadeIn(500);
                        }, 20);
                    }
                });
                // Bottom menu
                $('#planets').html(Template.read.game_menu_planet({
                    assetsUrl       : window.assetsUrl,
                    planet_image    : 'p13',
                    planet_name     : 'planet'
                }));
            });
        };

        // Cache for the buildings rendered on the planet.
        this.buildings = {};

        // Cache for all the build timers that are set.
        this.intervals = {};

        // Then a few helper functions to make things work.
        // All of the build timer stuff needs to get moved to library.js, sometime.
        this.createBuildTimer = function(seconds, targetEl) {
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
                    // Refresh the planet.
                    scope.renderPlanet();
                } else {
                    formattedTime = Library.formatTime(seconds);
                    // This is faster than jQuery.
                    document.getElementById(targetEl).innerHTML = formattedTime;
                }
            }, 1000);
            // Log the interval. For later destruction.
            this.intervals[interval] = 1;
        };

        this.clearBuildTimers = function() {
            var keys = Object.keys(this.intervals);
            for (var i = 0; i < keys.length; i++) {
                clearInterval(keys[i]);
            }
        };
    }

    return new MapPlanet();
});
