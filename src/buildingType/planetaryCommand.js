// Hello!
// You'll be reading this to gain a better understand of how everything here
// is coded! You've come to the right place! Let's get started right away!

// The define function lets us defined "modules" or sections of the code,
// we use this to keep things neat and tidy. 

// The first parameter in the define function is an array of dependences for the 
// module. As you can see, we need jQuery, Lacuna and Template (Pro'lly more later).
// These modules are then loaded and sent into the function that can be seen in 
// parameter 2.
define(['jquery', 'lacuna', 'template', 'body'], function($, Lacuna, Template, Body) {
    
    // Now we need to load the file that has all of the HTML templates we'll be
    // using within this file. Once this template has been loaded, they can be
    // accessed through the Template.read object. An example of how this loading
    // can be seen below in the getTabs function.
    Template.load('building/planetaryCommand');

    // This function, at least to my way of thinking, is a JavaScript class. It
    // is what we use to represent it as a module for RequireJs to understand.
    // There's more notes on this near the bottom of the file.
    function PlanetaryCommand() {

        // Throughout the adventure that is this client, jQuery does some
        // strange things to the 'this' keyword. So, to counter that, we use
        // scope instead. The name of the variable does not matter, but we have
        // created the convention of calling it 'scope'.
        // When using scope, declare all functions as scope.myFunction = (whatever)
        // but, when setting or using scope wide variables, assign them to scope.
        var scope = this;

        // Get any additional tabs for this building (if there are none, then you
        // don't need to create this module!)
        //
        // vBuilding, the building object returned from the 'view' call against the building url
        scope.getTabs = function(vBuilding, url) {
            //console.log(Body);
            return [
                {
                    name: 'Planet',
                    content: Template.read.building_planetary_command_planet_tab({
                        // This will be using a lot of the Body module.
                    })
                },
                {
                    name: 'Abandon',
                    content: Template.read.building_planetary_command_abandon_tab(),
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
        
        scope.setupAbandonTab = function() {
            // Apply the event handlers to the Abandon tab.
        };

        scope.setupRenameTab = function() {
            // Apply the event handlers to the Rename tab.
        };

        scope.populatePlansTab = function() {
            // Makes server request, populates items into the tab.
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
    }

    return new PlanetaryCommand();
});
