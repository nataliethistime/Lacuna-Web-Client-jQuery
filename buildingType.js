// This defines a 'building type', e.g. SpacePort but in the generic sense
// i.e. it does not describe a specific instance of a building (e.g. the building at location x,y on planet q)
// It defines methods to display information about a type of building
//
define(['jquery', 'lacuna', 'library', 'template', 'body', 'buildingType/defaultBuilding'], function($, lacuna, library, template, body, defaultBuildingType) {

    template.load('building');

    // I don't like this, I prefer to detect if the file exists and if so load it
    // if not load the default. But I have not found a neat way to do this (yet)
    // an alternative is to put this info into resources.json?
    var moduleTypes = {
        planetarycommand    :   'planetaryCommand'
    };

    function BuildingType() {
        var scope = this;
        var modules = new Array();

        // View the building Dialog
        this.view = function(building) {

            lacuna.send({
                module: building.url,
                method: 'view',
                params: [
                    lacuna.getSession(),
                    building.id
                ],

                success: function(o) {
                    var tabs = [{
                        name    : 'View',
                        content : scope.getViewTab(o.result.building)
                    }];

                    // Remove the leading slash.
                    building.type = building.url.replace('/', '');
                    if (modules[building.type]) {
                        // Use the cached value
                        scope.createTabs(tabs, o.result.building, modules[building.type]);
                    }
                    else {
                        if (moduleTypes[buildingType]) {
                            require(['buildingType/'+loadBuildingType], function(loadedBuildingType) {
                                // We only have to load it once, then we can use the cached value
                                loadedBuildingType.url = building.url;
                                modules[building.type] = loadedBuildingType;
                                scope.createTabs(tabs, o.result.building, loadedBuildingType);
                            });
                        }
                        else {
                            modules[building.type] = defaultBuildingType;
                        }
                    }
                }
            });
        };

        // Add any building specific tabs, output the building Dialog box
        //
        this.createTabs = function(tabs, building, loadedBuildingType) {
            var extraTabs = loadedBuildingType.getTabs();

            // Put 'em together.
            if (extraTabs) {
                tabs = tabs.concat(extraTabs);
            }

            var panel = lacuna.Panel.newTabbedPanel({
                draggable       : true,
                name            : building.type + ' ' + building.level,
                preTabContent   : scope.getBuildingHeader(building, loadedBuildingType),
                tabs            : tabs
            });

            // Now that everything is on the screen, add in all the events.
            if (building.downgrade.can) {
                $('#downgradeButton_' + building.id).on(
                    'click', {
                        building    : building,
                        url         : loadedBuildingType.url,
                        panel       : panel
                    },
                this.downgrade
                );
            }
            if (building.upgrade.can) {
                $('#upgradeButton_' + building.id).on(
                    'click', {
                        building    : building,
                        url         : loadedBuildingType.url,
                        panel       : panel
                    },
                    this.upgrade
                );
            }

            $('#demolishButton_' + building.id).on(
                'click', {
                    building    : building,
                    url         : loadedBuildingType.url,
                    panel       : panel
                },
                this.demolish
            );
        };

        this.getBuildingHeader = function(building, buildingType) {
            return template.read.building_header({
                background_image    : $('#lacuna').css('background-image'),
                assets_url          : window.assetsUrl,
                building_image      : building.image,
                building_desc       : lacuna.getBuildingDesc(buildingType.url)
            });
        };

        this.getViewTab = function(o) {
            var currentProduction = template.read.building_current_production({
                assets_url      : window.assetsUrl,
                food_hour       : library.formatNum(o.food_hour),
                ore_hour        : library.formatNum(o.ore_hour),
                water_hour      : library.formatNum(o.water_hour),
                energy_hour     : library.formatNum(o.energy_hour),
                waste_hour      : library.formatNum(o.waste_hour),
                happiness_hour  : library.formatNum(o.happiness_hour),
                building_id     : o.id
            });
            var upgradeProduction = template.read.building_upgrade_production({
                assets_url: window.assetsUrl,
                up_food_hour: library.formatNum(o.upgrade.production.food_hour),
                up_ore_hour: library.formatNum(o.upgrade.production.ore_hour),
                up_water_hour: library.formatNum(o.upgrade.production.water_hour),
                up_energy_hour: library.formatNum(o.upgrade.production.energy_hour),
                up_waste_hour: library.formatNum(o.upgrade.production.waste_hour),
                up_happy_hour: library.formatNum(o.upgrade.production.happiness_hour),
                up_food_bad: parseInt(o.upgrade.production.food_hour) > parseInt(body.get.food_hour),
                up_ore_bad: parseInt(o.upgrade.production.ore_hour) > parseInt(body.get.ore_hour),
                up_water_bad: parseInt(o.upgrade.production.water_hour) > parseInt(body.get.water_hour),
                up_energy_bad: parseInt(o.upgrade.production.energy_hour) > parseInt(body.get.energy_hour),
                up_happy_bad: parseInt(o.upgrade.production.happiness_hour) > parseInt(body.get.happiness_hour),
                building_id: o.id,
                to_level: parseInt(o.level) - 1,
                downgrade_reason: o.downgrade.reason[1],
                can_downgrade: o.downgrade.can
            });
            var upgradeCost = template.read.building_upgrade_cost({
                assets_url: window.assetsUrl,
                up_food_cost: library.formatNum(o.upgrade.cost.food || 0),
                up_ore_cost: library.formatNum(o.upgrade.cost.ore || 0),
                up_water_cost: library.formatNum(o.upgrade.cost.water || 0),
                up_energy_cost: library.formatNum(o.upgrade.cost.energy || 0),
                up_waste_cost: library.formatNum(o.upgrade.cost.waste || 0),
                up_time_cost: library.formatNum(o.upgrade.cost.time || 15),
                up_food_bad: parseInt(o.upgrade.cost.food) > parseInt(body.get.food_storage),
                up_ore_bad: parseInt(o.upgrade.cost.ore) > parseInt(body.get.ore_storage),
                up_water_bad: parseInt(o.upgrade.cost.water) > parseInt(body.get.water_storage),
                up_energy_bad: parseInt(o.upgrade.cost.energy) > parseInt(body.get.energy_storage),
                up_waste_bad: parseInt(o.upgrade.cost.waste) > parseInt(body.get.waste_storage),
                building_id: o.id,
                to_level: parseInt(o.level) + 1,
                upgrade_reason: o.upgrade.reason[1],
                can_upgrade: o.upgrade.can
            });

            return [
                currentProduction,
                upgradeProduction,
                upgradeCost
            ].join('');
        };

        this.upgrade = function(e) {

            // TODO: As per the current Web Client there is a popup
            // which warns users about accidentally upgrading a
            // building and using Halls. I do not like this
            // approach to the situation. Need to find a better way
            // to show the warning but not bother the more experienced
            // players with extra clicking.

            lacuna.send({
                module: e.data.url,
                method: 'upgrade',

                params: [
                    lacuna.getSession(),
                    e.data.building.id
                ],
                
                success: function(o) {
                    // Close the panel.
                    e.data.panel.close(function() {
                        // nothing to do, building updates take care of themselves now    
                    });
                }
            });
        };

        this.downgrade = function(e) {
            lacuna.confirm('Are you sure you want to downgrade your ' + e.data.building.name +
                ' to level ' + (parseInt(e.data.building.level) - 1) + '?',
            undefined, function(response) {
                // Once the user has confirmed that they actually
                // want to downgrade the building, do it!
                if (response) {
                    lacuna.send({
                        module: e.data.url,
                        method: 'downgrade',
                        params: [
                            lacuna.getSession(),
                            e.data.building.id
                        ],
                        
                        success: function(o) {
                            // Close the panel.
                            e.data.panel.close(function() {
                                // nothing to do, building updates take care of themselves now
                            });
                        }
                    });
                }
            });
        };

        this.demolish = function(e) {
            lacuna.confirm(
                'Are you sure you want to demolish your ' + e.data.building.name + '?',
            undefined, function(response) {
                if (response) {
                    lacuna.send({
                        module: e.data.url,
                        method: 'demolish',
                        
                        params: [
                            lacuna.getSession(),
                            e.data.building.id
                        ],
                        
                        success: function(o) {
                            // Close the panel.
                            e.data.panel.close(function() {
                                // nothing to do, building updates take care of themselves now
                            });
                        }
                    });
                }
            });
        };
    }
    
    return new BuildingType();
});
