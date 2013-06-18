// This defines the HTML structure to contain the buildings to be displayed in the planet image.

define(['jquery', 'lacuna', 'library', 'buildingType', 'buildings', 'template', 'body', 'queue'], function($, Lacuna, Library, BuildingType, Buildings, Template, Body, Queue) {
    function MapPlanet() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        // Cache for the buildings rendered on the planet.
        scope.buildings = {};

        // Cache for all the build timers that are set.
        scope.intervals = {};

        Template.load(['mapPlanet']);

        // This only creates the HTML 'framework' into which the planet details are put
        // it relies on callbacks to update the content whenever the body changes
        // In this way we only need to generate the framework once, not every time the body 
        // changes.
        scope.renderPlanet = function() {
            var buildingsTemplate = [];
            
            // Remove event listeners.
            $('#buildingsParent').off('click mouseenter mouseleave');

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
                            // in the scope.buildings object that matches
                            // the selected plot, then the building view
                            // panel will be opened. Otherwise, the plot
                            // will be assumed empty, and the build panel
                            // will be opened.
                            if (scope.buildings[e.data.borderEl]) {
                                // Open view panel.
                                BuildingType.view(scope.buildings[e.data.borderEl]);
                            } else {
                                // Open build panel.
                                // TODO
                                Lacuna.alert("This is the building panel.");
                            }
                        }
                    }, '#' + idStr, {
                        borderEl: idStr,
                        centerEl: idStrCenter
                    });

                    // Update the building specific data when it changes
                    Buildings.callbackAdd(x, y, scope.update_building);
                }
            }
 
            // Send it to the DOM.
            $('#buildingsParent').html([
                '<div id="buildingsDraggableChild">',
                buildingsTemplate.join(''),
                '</div>'].join('')
            );
 
            // Update the body specific data when it changes
            Body.callbacks.add(scope.update_body);
            Body.backgroundCallbacks.add(scope.update_background);

            // Final bits
            scope.resize();
            $('#buildingsDraggableChild').draggable();
        };

        // What to do when the 'body' details change
        // Note, we can also do this if the screen is resized
        scope.update_body = function(loadedBody) {
            $('#planets').html(Template.read.game_menu_planet({
                assetsUrl       : window.assetsUrl,
                planet_image    : loadedBody.image,
                planet_name     : loadedBody.name
            }));
        };

        // What to do if the surface_image changes
        scope.update_background = function(surface_image) {
            $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/planet_side/" + surface_image + ".jpg')");
        };

        // To call if the screen is resized
        scope.resize = function() {
            // Center the view.
            var parent  = $('#lacuna'), // Basically, the height of the screen.
                height  = parent.height(),
                width   = parent.width()
            ;

            $('#buildingsDraggableChild').css({
                top     : (height / 2) - 550,
                left    : (width / 2) - 550
            });
        };

        // What to do if the building changes
        scope.update_building = function(building) {
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
                building_level  : building.level,
                efficiency_width : 10,
                efficiency      : building.efficiency,
                needs_repair    : building.efficiency < 100 ? 1 : 0
            }));

            scope.buildings[idStr] = building;
            if (building.pending_build) {
                Queue.addQueueItem(idStrCounter,  building.pending_build.seconds_remaining);
            }
        };
    }

    return new MapPlanet();
});
