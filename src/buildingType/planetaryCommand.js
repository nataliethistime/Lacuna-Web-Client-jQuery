// Hello!
// You'll be reading this to gain a better understand of how everything here
// is coded! You've come to the right place! Let's get started right away!

// The define function lets us define "modules" or sections of the code,
// we use this to keep things neat and tidy. 

// The first parameter in the define function is an array of dependences for the 
// module. As you can see, we need jQuery, Lacuna, Template, Body and Library.
// These modules are then loaded and sent into the function that can be seen in 
// parameter 2.
define(['jquery', 'lacuna', 'template', 'body', 'library', 'text!templates/building/planetaryCommand.tmpl'], 
function($, Lacuna, Template, Body, Library, TmplBuildingPlanetaryCommand) {
    
    // Now we need to load the file that has all of the HTML templates we'll be
    // using within this file. Once this template has been loaded, they can be
    // accessed through the Template.read object. An example of how this loading
    // can be seen below in the getTabs function.
    Template.loadStrings(TmplBuildingPlanetaryCommand);

    // This function, at least to my way of thinking, is a JavaScript class. It
    // is what we use to represent it as a module for RequireJs to understand.
    // There's more notes on this near the bottom of the file.
    function PlanetaryCommand() {

        // Throughout the adventure that is this client, jQuery does some
        // strange things to the 'this' keyword. So, to counter that, we use
        // scope instead. The name of the variable does not matter, but we have
        // created the convention of calling it 'scope'.
        // When using scope, declare all functions and variables as children of
        // the scope object.
        var scope = this;

        // Get any additional tabs for this building (if there are none, then you
        // don't need to create this module!)
        //
        // vBuilding is the building object returned from the 'view' call to the 
        // selected building.
        scope.getTabs = function(vBuilding, url) {
            console.log(this);//debug
            return [
                {
                    name: 'Planet',
                    content: Template.read.building_planetary_command_planet_tab({
                        // This will be using a lot of the Body module.
                        buildings: Body.get.building_count,
                        planetSize: Body.get.size,
                        plotsAvailable: Body.get.plots_available,
                        population: Library.formatNum(Body.get.population),

                        // Not easy to find a clean way to access this, leaving until further discussion.
                        nextColonyCost: Library.formatNum(1),
                        
                        location: Body.get.x + ', ' + Body.get.y,
                        zone: Body.get.zone,
                        star: Body.get.star_name,
                        orbit: Body.get.orbit
                    })
                },
                {
                    name: 'Abandon',
                    content: Template.read.building_planetary_command_abandon_tab({
                        name: Body.get.name
                    }),
                    select: scope.setupAbandonTab
                },
                {
                    name: 'Rename',
                    content: Template.read.building_planetary_command_rename_tab(),
                    select: scope.setupRenameTab
                },
                {
                    name: 'Plans',
                    select: scope.populatePlansTab
                },
                {
                    name: 'Resources',
                    select: scope.populateResourcesTab
                },
                {
                    name: 'Supply Chains',
                    select: scope.populateChainsTab
                },
                {
                    name: 'Storage',
                    select: scope.populateStorageTab
                }
            ];
        };

        // Add any events that need to be set up for the tabs
        //
        scope.addEvents = function(vBuilding, url) {
        };
        
        scope.setupAbandonTab = function(tab) {
            $('#abandonPlanetButton').on('click', scope.abandonPlanet);
        };

        scope.setupRenameTab = function(tab) {
            $('#renamePlanetButton').on('click', scope.renamePlanet);
        };

        scope.populatePlansTab = function(tab) {
            var deferredViewPlans = Lacuna.send({
                module  : '/planetarycommand',
                method  : 'view_plans',
                params  : [
                    Lacuna.getSession(),
                    scope.building.id
                ]
            });

            deferredViewPlans.done(function(o) {
                if (o.result.plans.length) {

                    var content = [];

                    _.each(o.result.plans, function(plan) {
                        content.push(Template.read.building_planetary_command_plan({
                            plan: plan
                        }));
                    });

                    tab.add(Template.read.building_planetary_command_plans_heading({
                        content: content.join('')
                    }));
                    
                }
                else {
                    tab.add(Template.read.building_planetary_command_plans_none());
                }
            });
        };

        scope.populateResourcesTab = function() {
            // Makes server request, populates items into the tab.
        };

        scope.populateChainsTab = function() {
            // Makes server request, populates items into the tab.
        };

        scope.populateStorageTab = function() {
            // Now that I've written this, I'm not sure it's needed.
        };

        // Function that makes the actual abandon call to the server.
        scope.abandonPlanet = function() {
            Lacuna.confirm(
                'Are you sure you want to abandon ' + Body.get.name + '?',
                'Look out!',
                function(response) {
                
                if (response) {
                    var deferredAbandon = Lacuna.send({
                        module  : '/body',
                        method  : 'abandon',
                        params  : [
                            Lacuna.getSession(),
                            Body.get.id
                        ]
                    });
                    deferredAbandon.done(function(o) {
                        // TODO
                    });
                }

            });
        };

        scope.renamePlanet = function() {

            var newName = $('#renamePlanetInput').val();

            if (newName) {
                var deferredRename = Lacuna.send({
                    module  : '/body',
                    method  : 'rename',
                    params  : [
                        Lacuna.getSession(),
                        Body.get.id,
                        newName
                    ]
                });
                deferredRename.done(function(o) {
                    if (o.result) {
                        Body.update({
                            name: newName
                        });
                    }
                });
            }
        };
    }

    return new PlanetaryCommand();
});
