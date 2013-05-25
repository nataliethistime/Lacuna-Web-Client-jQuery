// This defines a 'building type', e.g. SpacePort but in the generic sense
// i.e. it does not describe a specific instance of a building (e.g. the building at location x,y on planet q)
// It defines methods to display information about a type of building
//
define(['jquery', 'underscore', 'lacuna', 'library', 'template', 'body', 'buildingType/defaultBuilding']
, function($, _, Lacuna, Library, Template, Body, DefaultBuildingType) {

    Template.load('building');

    // Only define moduleTypes here that have extra tab types, otherwise
    // the default takes care of it.
    // Might move this into resources.json at some point.
    var moduleTypes = {
        planetarycommand    :   'planetaryCommand',
        shipyard            :   'shipyard'
    };

    function BuildingType() {
        var scope = this;
        var modules = new Array();

        // View the building Dialog
        this.view = function(building) {

            Lacuna.send({
                module: building.url,
                method: 'view',
                params: [
                    Lacuna.getSession(),
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
                        if (moduleTypes[building.type]) {
                            require(['buildingType/'+building.type], function(loadedBuildingType) {
                                // We only have to load it once, then we can use the cached value
                                loadedBuildingType.building = building;
                                modules[building.type] = loadedBuildingType;
                                scope.createTabs(tabs, o.result.building, loadedBuildingType);
                            });
                        }
                        else {
                            var cloneBuildingType = _.clone(DefaultBuildingType);
                            cloneBuildingType.building = building;
                            modules[building.type] = cloneBuildingType;
                            scope.createTabs(tabs, o.result.building, cloneBuildingType);
                        }
                    }
                }
            });
        };

        // Add any building specific tabs, output the building Dialog box
        //
        this.createTabs = function(tabs, building, loadedBuildingType) {

            if (building.efficiency < 100) {
                var repairTab = {
                    name    : 'Repair',
                    content : Template.read.building_repair({
                        assets_url  : window.assetsUrl,
                        building_id : building.id,
                        efficiency  : building.efficiency,
                        food        : building.repair_costs.food,
                        ore         : building.repair_costs.ore,
                        water       : building.repair_costs.water,
                        energy      : building.repair_costs.energy
                    })
                };
                tabs = tabs.concat([repairTab]);
                $('#repairButton_' + building.id).on(
                    'click', {
                        building    : building,
                        url         : loadedBuildingType.url,
                        panel       : panel
                    },
                    this.repair
                );
            }
            else {
                var extraTabs = loadedBuildingType.getTabs();
                if (extraTabs.length) {
                    tabs = tabs.concat(extraTabs);
                }
            }

            // Replace out the ' in "Gratch's Gauntlet"
            var panelName = building.name.replace("'","") + ' ' + building.level;

            var panel = Lacuna.Panel.newTabbedPanel({
                draggable       : true,
                name            : panelName,
                preTabContent   : scope.getBuildingHeader(building, loadedBuildingType.building),
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
            return Template.read.building_header({
                background_image    : $('#lacuna').css('background-image'),
                assets_url          : window.assetsUrl,
                building_image      : building.image,
                building_desc       : Lacuna.getBuildingDesc(buildingType.url)
            });
        };

        this.getViewTab = function(o) {
            var currentProduction = Template.read.building_current_production({
                assets_url      : window.assetsUrl,
                food_hour       : Library.formatNum(o.food_hour),
                ore_hour        : Library.formatNum(o.ore_hour),
                water_hour      : Library.formatNum(o.water_hour),
                energy_hour     : Library.formatNum(o.energy_hour),
                waste_hour      : Library.formatNum(o.waste_hour),
                happiness_hour  : Library.formatNum(o.happiness_hour),
                building_id     : o.id
            });
            var upgradeProduction = Template.read.building_upgrade_production({
                assets_url: window.assetsUrl,
                up_food_hour: Library.formatNum(o.upgrade.production.food_hour),
                up_ore_hour: Library.formatNum(o.upgrade.production.ore_hour),
                up_water_hour: Library.formatNum(o.upgrade.production.water_hour),
                up_energy_hour: Library.formatNum(o.upgrade.production.energy_hour),
                up_waste_hour: Library.formatNum(o.upgrade.production.waste_hour),
                up_happy_hour: Library.formatNum(o.upgrade.production.happiness_hour),
                up_food_bad: parseInt(o.upgrade.production.food_hour) > parseInt(Body.get.food_hour),
                up_ore_bad: parseInt(o.upgrade.production.ore_hour) > parseInt(Body.get.ore_hour),
                up_water_bad: parseInt(o.upgrade.production.water_hour) > parseInt(Body.get.water_hour),
                up_energy_bad: parseInt(o.upgrade.production.energy_hour) > parseInt(Body.get.energy_hour),
                up_happy_bad: parseInt(o.upgrade.production.happiness_hour) > parseInt(Body.get.happiness_hour),
                building_id: o.id,
                to_level: parseInt(o.level) - 1,
                downgrade_reason: o.downgrade.reason[1],
                can_downgrade: o.downgrade.can
            });
            var upgradeCost = Template.read.building_upgrade_cost({
                assets_url: window.assetsUrl,
                up_food_cost: Library.formatNum(o.upgrade.cost.food || 0),
                up_ore_cost: Library.formatNum(o.upgrade.cost.ore || 0),
                up_water_cost: Library.formatNum(o.upgrade.cost.water || 0),
                up_energy_cost: Library.formatNum(o.upgrade.cost.energy || 0),
                up_waste_cost: Library.formatNum(o.upgrade.cost.waste || 0),
                up_time_cost: Library.formatNum(o.upgrade.cost.time || 15),
                up_food_bad: parseInt(o.upgrade.cost.food) > parseInt(Body.get.food_storage),
                up_ore_bad: parseInt(o.upgrade.cost.ore) > parseInt(Body.get.ore_storage),
                up_water_bad: parseInt(o.upgrade.cost.water) > parseInt(Body.get.water_storage),
                up_energy_bad: parseInt(o.upgrade.cost.energy) > parseInt(Body.get.energy_storage),
                up_waste_bad: parseInt(o.upgrade.cost.waste) > parseInt(Body.get.waste_storage),
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

        this.repair = function(e) {
            Lacuna.send({
                module  : e.data.url,
                method  : 'repair',
                params  : [
                    Lacuna.getSession(),
                    e.data.building.id
                ],
                success: function(o) {
                    e.data.panel.close();
                }
            });
        };

        this.upgrade = function(e) {

            // TODO: As per the current Web Client there is a popup
            // which warns users about accidentally upgrading a
            // building and using Halls. I do not like this
            // approach to the situation. Need to find a better way
            // to show the warning but not bother the more experienced
            // players with extra clicking.

            Lacuna.send({
                module: e.data.url,
                method: 'upgrade',

                params: [
                    Lacuna.getSession(),
                    e.data.building.id
                ],
                
                success: function(o) {
                    e.data.panel.close();
                }
            });
        };

        this.downgrade = function(e) {
            Lacuna.confirm('Are you sure you want to downgrade your ' + e.data.building.name +
                ' to level ' + (parseInt(e.data.building.level) - 1) + '?',
            undefined, function(response) {
                // Once the user has confirmed that they actually
                // want to downgrade the building, do it!
                if (response) {
                    Lacuna.send({
                        module: e.data.url,
                        method: 'downgrade',
                        params: [
                            Lacuna.getSession(),
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
            Lacuna.confirm(
                'Are you sure you want to demolish your ' + e.data.building.name + '?',
            undefined, function(response) {
                if (response) {
                    Lacuna.send({
                        module: e.data.url,
                        method: 'demolish',
                        
                        params: [
                            Lacuna.getSession(),
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
