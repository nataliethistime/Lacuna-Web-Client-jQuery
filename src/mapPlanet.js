// This defines the HTML structure to contain the buildings to be displayed in the planet image.

define(['jquery', 'underscore', 'lacuna', 'library', 'buildingType', 'template', 'body', 'queue', 'text!templates/mapPlanet.tmpl'], 
function($, _, Lacuna, Library, BuildingType, Template, Body, Queue, TmplMapPlanet) {
    function MapPlanet() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        // Cache for buildings being displayed in the planet.
        scope.buildings = {};

        Template.loadStrings(TmplMapPlanet);

        // Used to display a different planet to what is on the screen.
        // If you want to update the current planet, see scope.refreshPlanet()
        // below.
        scope.showPlanet = function(bodyId) {

            // Firstly, clear all of the previous data. This creates a blank
            // slate for the buildings to be put on.
            scope.resetPlanetView();

            // Make the 'get_buildings' request and then display it all on
            // the screen.
            scope.getBuildings(bodyId);
        };

        // Do the final bits of the render process.
        scope.finishPlanetView = function() {
            scope.centerView();
            $('#buildingsDraggableChild').draggable();
        };

        scope.resetPlanetView = function() {
            // Remove event listeners from previous view.
            $('#buildingsParent').off('click mouseenter mouseleave');

            // Clear the cache of buildings data.
            scope.buildings = {};

            var content = [];
            for (var x = -5; x < 6; x++) {
                for (var y = -5; y < 6; y++) {
                    var idStr       = scope.getIdStr(x,y),
                        idStrCenter = idStr + '_center'
                    ;

                    content.push(Template.read.game_mapPlanet_plot({
                        assetsUrl       : window.assetsUrl,
                        idStr           : idStr,
                        idStrCenter     : idStrCenter,
                        x               : x,
                        y               : y,
                        size            : 100
                    }));

                    $('#buildingsParent').on({
                        // Mouseover effects
                        mouseenter: scope.displayTileBorder,
                        mouseleave: scope.hideTileBorder,
                        
                        // Click handler.
                        click: scope.handleBuildingClick
                    }, '#' + idStr, {
                        borderEl: idStr,
                        centerEl: idStrCenter
                    });
                }
            }

            // Send it to the DOM.
            $('#buildingsParent').html([
                '<div id="buildingsDraggableChild">',
                    content.join(''),
                '</div>'
            ].join(''));
        };

        // Function that makes the 'get_buildings' call.
        // Pases loaded data onto scope.loadBuildings.
        scope.getBuildings = function(bodyId) {
            var deferredGetBuildings = Lacuna.send({
                module: '/body',
                method: 'get_buildings',

                params: [
                    Lacuna.getSession(), // Session Id
                    bodyId               // Body Id
                ]
            });

            deferredGetBuildings.done(scope.loadBuildings);
        };

        scope.loadBuildings = function(o) {

            // Then we're just updating the entire list of buildings.
            if (_.size(scope.buildings) === 0) {
                
                // Loop.. and... update!
                _.each(o.result.buildings, function(item, key) {
                    scope.updateBuilding(item, key);
                });
            }
            else {
                // We're doing a planet *refresh* where I need to figure
                // out the object game.
            }

            scope.finishPlanetView();
        }; 

        scope.updateBuilding = function(building, id) {
            var idStr      = scope.getIdStr(building.x, building.y),
                buildingEl = $('#' + idStr);
            
            // Add some interesting things to the building.
            building.id    = id;
            building.idStr = idStr;
            building.idStrCenter = idStr + '_center';
            building.idStrCounter = idStr + '_counter';

            // Make the CSS changes.
            buildingEl.css(
                'background-image',
                'url(\'' + window.assetsUrl + '/planet_side/100/' + building.image + '.png\')'
            );

            // Update the level and efficiency indicator.
            buildingEl.html(Template.read.game_mapPlanet_building_level({
                pending_build    : building.pending_build,
                idStrCounter     : building.idStrCounter,
                idStrCenter      : building.idStrCenter,
                building_level   : building.level,
                efficiency_width : 10,
                efficiency       : building.efficiency,
                needs_repair     : building.efficiency < 100 ? 1 : 0
            }));

            // TODO: Insert build timer handling here.

            // Add the building the the cache.
            scope.buildings[idStr] = building;
        };

        // What to do if the surface_image changes
        scope.updateSurface = function(surface_image) {
            $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/planet_side/" + surface_image + ".jpg')");
        };

        Body.backgroundCallbacks.add(scope.updateSurface);

        // To call if the screen is resized
        scope.centerView = function() {
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

        // Get the unique ID for a plot
        scope.getIdStr = function(x, y) {
            return 'plot_' + x + '_' + y;
        };

        // Called when the user clicks on a building.
        scope.handleBuildingClick = function(e) {
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
                // TODO: Open build panel.
                Lacuna.alert("This is the build-a-building panel.");
            }
        };

        scope.displayTileBorder = function(e) {
            // Display the pretty border.
            $('#' + e.data.borderEl).css({
                'border-style': 'dashed',
                'border-color': 'white',
                'border-width': '2px',
                'margin': '0px' // Stop the images jumping around.
            });

            // Then the level/build number/image.
            $('#' + e.data.centerEl).css('display', '');
        };

        scope.hideTileBorder = function(e) {
            // Hide the border.
            $('#' + e.data.borderEl).css({
                'border-style': '',
                'border-color': '',
                'border-width': '',
                'margin': '2px' // Stop the images jumping around.
            });
            // Then the level/build number/image.
            $('#' + e.data.centerEl).css('display', 'none');
        };
    }

    return new MapPlanet();
});
