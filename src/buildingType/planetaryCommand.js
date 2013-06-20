

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
            
            // The getTabs function returns an array of tabs that will be
            // displayed in the selected building panel. The properties
            // of each object and their uses will be explain below.
            return [
                {
                    // Explains itself, it's the name label that the tab will
                    // have both in the DOM and on the screen.
                    name: 'Planet',

                    // Content is any of the HTML that can be thrown into the
                    // tab straight away, without needing to send a request.
                    // In this case, all of the data has been received in the 
                    // previous server request (most likely 'view') and can be
                    // spat out onto the screen.
                    // As mentioned before, we use a template system for as
                    // much of the HTML used in the client as possible. Which
                    // ends up being about 99% of it. If we want a variable
                    // passed into that template, we can pass it in this here
                    // object. In this case, we are passing in strings and an
                    // object, both of which are acceptable.
                    content: Template.read.building_planetary_command_planet_tab({
                        
                        // Functions cannot be accessed when variables are
                        // being pasted in. So, we do all of it's 
                        // manipulation here instead of inside the template
                        // while it's being loaded.
                        population: Library.formatNum(Body.get.population),
                        nextColonyCost: Library.formatNum(1) + ' - TODO', // TODO

                        body: Body.get,
                        assetsUrl: window.assetsUrl
                    })
                },
                {
                    name: 'Abandon',
                    content: Template.read.building_planetary_command_abandon_tab({
                        name: Body.get.name
                    }),

                    // The select option, in my opinion, is the most useful of
                    // them all. :) It should be set to a function. This
                    // function is then called when the user selects this tab.
                    // Passed in as the first param of that function, is a tab
                    // object, it has a few utilities which can be used on the
                    // tab. They are covered in the scope.populatePlansTab 
                    // function.
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

                    tab.html(Template.read.building_planetary_command_plans_heading({
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

    // The define function must return what we want to be the class it
    // represents. After much experimentation, we've found that this is the
    // cleanest way to do it.
    return new PlanetaryCommand();
});
