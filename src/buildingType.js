// This defines a 'building type', e.g. SpacePort but in the generic sense
// i.e. it does not describe a specific instance of a building (e.g. the building at location x,y on planet q)
// It defines methods to display information about a type of building
//
define(['jquery', 'underscore', 'lacuna', 'library', 'template', 'body', 'panel', 'require', 'buildingType/defaultBuilding']
, function($, _, Lacuna, Library, Template, Body, Panel, require, DefaultBuildingType) {

    Template.load('building');

    // Only define moduleTypes here that have extra tab types, otherwise
    // the default takes care of it.
    // Might move this into resources.json at some point.
    var moduleTypes = {
        planetarycommand    :   'planetaryCommand',
        shipyard            :   'shipyard',
        spaceport           :   'spacePort'
    };

    // To try to reduce confusion over the various 'building' objects.
    // pBuilding, the building object returned from a planet 'get_buildings' call
    // vBuilding, the building object returned from the 'view' call against the building url
    // buildingType is the generic object class representing that type of building

    function BuildingType() {
        var scope = this;
        var modules = new Array();

        // View the building Dialog
        this.view = function(pBuilding) {

            Lacuna.send({
                module: pBuilding.url,
                method: 'view',
                params: [
                    Lacuna.getSession(),
                    pBuilding.id
                ],

                success: function(o) {
                    var vBuilding   = o.result.building;
                    var url         = pBuilding.url;
                    var tabs = [{
                        name    : 'Production',
                        content : scope.getProductionTab(vBuilding)
                    }];

                    // Remove the leading slash from the url to get the building 'type'.
                    var building_type = url.replace('/', '');

                    if (modules[building_type]) {
                        scope.createTabs(tabs, vBuilding, url, modules[building_type]);
                    }
                    else {
                        if (moduleTypes[building_type]) {
                            // it is a building type with it's own handler code
                            require(['buildingType/'+moduleTypes[building_type]], function(buildingType) {
                                // We only have to load it once, then we can use the cached value
                                // for convenience, put the url in the buildingType
                                modules[building_type] = buildingType;
                                scope.createTabs(tabs, vBuilding, url, modules[building_type]);
                            });
                        }
                        else {
                            // it is a 'generic' building with no special handlers
                            modules[building_type] = DefaultBuildingType;
                            scope.createTabs(tabs, vBuilding, url, modules[building_type]);
                        }
                    }
                }
            });
        };

        // Add any building specific tabs, output the building Dialog box
        //
        this.createTabs = function(tabs, vBuilding, url, buildingType) {

            // Replace out the ' in "Gratch's Gauntlet" and the '[' in Beach plans
            // I am not convinced this is the best way of doing this.
            var panelName = vBuilding.name.replace(/\W/g," ") + ' ' + vBuilding.level;
            if (vBuilding.efficiency < 100) {
                var repairTab = {
                    name    : 'Repair',
                    content : Template.read.building_repair({
                        assets_url  : window.assetsUrl,
                        building_id : vBuilding.id,
                        efficiency  : vBuilding.efficiency,
                        food        : vBuilding.repair_costs.food,
                        ore         : vBuilding.repair_costs.ore,
                        water       : vBuilding.repair_costs.water,
                        energy      : vBuilding.repair_costs.energy
                    })
                };
                tabs = tabs.concat([repairTab]);
            }
            else {
                var extraTabs = buildingType.getTabs(vBuilding, url);
                if (extraTabs.length) {
                    tabs = tabs.concat(extraTabs);
                }
            }
            var panel = Panel.newTabbedPanel({
                draggable       : true,
                name            : panelName,
                preTabContent   : scope.getBuildingHeader(vBuilding, url),
                tabs            : tabs
            });


            if (vBuilding.efficiency < 100) {
                $('#repairButton_' + vBuilding.id).on(
                    'click', {
                        vBuilding   : vBuilding,
                        url         : url,
                        panel       : panel
                    },
                    this.repair
                );
            }

            // Now that everything is on the screen, add in all the events.
            if (vBuilding.downgrade.can) {
                $('#downgradeButton_' + vBuilding.id).on(
                    'click', {
                        vBuilding   : vBuilding,
                        url         : url,
                        panel       : panel
                    },
                    this.downgrade
                );
            }
            if (vBuilding.upgrade.can) {
                $('#upgradeButton_' + vBuilding.id).on(
                    'click', {
                        vBuilding   : vBuilding,
                        url         : url,
                        panel       : panel
                    },
                    this.upgrade
                );
            }

            $('#demolishButton_' + vBuilding.id).on(
                'click', {
                    vBuilding   : vBuilding,
                    url         : url,
                    panel       : panel
                },
                this.demolish
            );
        };

        this.getBuildingHeader = function(vBuilding, url) {
            return Template.read.building_header({
                background_image    : $('#lacuna').css('background-image'),
                assets_url          : window.assetsUrl,
                building_image      : vBuilding.image,
                building_desc       : Lacuna.getBuildingDesc(url)
            });
        };

        this.getProductionTab = function(vBuilding) {
            var currentProduction = Template.read.building_current_production({
                assets_url      : window.assetsUrl,
                food_hour       : Library.formatNum(vBuilding.food_hour),
                ore_hour        : Library.formatNum(vBuilding.ore_hour),
                water_hour      : Library.formatNum(vBuilding.water_hour),
                energy_hour     : Library.formatNum(vBuilding.energy_hour),
                waste_hour      : Library.formatNum(vBuilding.waste_hour),
                happiness_hour  : Library.formatNum(vBuilding.happiness_hour),
                building_id     : vBuilding.id
            });
            var upgradeProduction = Template.read.building_upgrade_production({
                assets_url      : window.assetsUrl,
                up_food_hour    : Library.formatNum(vBuilding.upgrade.production.food_hour),
                up_ore_hour     : Library.formatNum(vBuilding.upgrade.production.ore_hour),
                up_water_hour   : Library.formatNum(vBuilding.upgrade.production.water_hour),
                up_energy_hour  : Library.formatNum(vBuilding.upgrade.production.energy_hour),
                up_waste_hour   : Library.formatNum(vBuilding.upgrade.production.waste_hour),
                up_happy_hour   : Library.formatNum(vBuilding.upgrade.production.happiness_hour),
                up_food_bad     : parseInt(vBuilding.upgrade.production.food_hour) > parseInt(Body.get.food_hour),
                up_ore_bad      : parseInt(vBuilding.upgrade.production.ore_hour) > parseInt(Body.get.ore_hour),
                up_water_bad    : parseInt(vBuilding.upgrade.production.water_hour) > parseInt(Body.get.water_hour),
                up_energy_bad   : parseInt(vBuilding.upgrade.production.energy_hour) > parseInt(Body.get.energy_hour),
                up_happy_bad    : parseInt(vBuilding.upgrade.production.happiness_hour) > parseInt(Body.get.happiness_hour),
                building_id     : vBuilding.id,
                to_level        : parseInt(vBuilding.level) - 1,
                downgrade_reason: vBuilding.downgrade.reason[1],
                can_downgrade   : vBuilding.downgrade.can
            });
            var upgradeCost = Template.read.building_upgrade_cost({
                assets_url      : window.assetsUrl,
                up_food_cost    : Library.formatNum(vBuilding.upgrade.cost.food || 0),
                up_ore_cost     : Library.formatNum(vBuilding.upgrade.cost.ore || 0),
                up_water_cost   : Library.formatNum(vBuilding.upgrade.cost.water || 0),
                up_energy_cost  : Library.formatNum(vBuilding.upgrade.cost.energy || 0),
                up_waste_cost   : Library.formatNum(vBuilding.upgrade.cost.waste || 0),
                up_time_cost    : Library.formatNum(vBuilding.upgrade.cost.time || 15),
                up_food_bad     : parseInt(vBuilding.upgrade.cost.food) > parseInt(Body.get.food_storage),
                up_ore_bad      : parseInt(vBuilding.upgrade.cost.ore) > parseInt(Body.get.ore_storage),
                up_water_bad    : parseInt(vBuilding.upgrade.cost.water) > parseInt(Body.get.water_storage),
                up_energy_bad   : parseInt(vBuilding.upgrade.cost.energy) > parseInt(Body.get.energy_storage),
                up_waste_bad    : parseInt(vBuilding.upgrade.cost.waste) > parseInt(Body.get.waste_storage),
                building_id     : vBuilding.id,
                to_level        : parseInt(vBuilding.level) + 1,
                upgrade_reason  : vBuilding.upgrade.reason[1],
                can_upgrade     : vBuilding.upgrade.can
            });

            return [
                currentProduction,
                upgradeProduction,
                upgradeCost
            ].join('');
        };

        this.repair = function(event) {
            Lacuna.send({
                module  : event.data.url,
                method  : 'repair',
                params  : [{
                    'session_id'    : Lacuna.getSession(),
                    'building_id'   : event.data.vBuilding.id
                }],
                success: function(o) {
                    event.data.panel.close();
                }
            });
        };

        this.upgrade = function(event) {

            // TODO: As per the current Web Client there is a popup
            // which warns users about accidentally upgrading a
            // building and using Halls. I do not like this
            // approach to the situation. Need to find a better way
            // to show the warning but not bother the more experienced
            // players with extra clicking.

            Lacuna.send({
                module: event.data.url,
                method: 'upgrade',

                params: [{
                    'session_id'    : Lacuna.getSession(),
                    'building_id'   : event.data.vBuilding.id
                }],
                
                success: function(o) {
                    event.data.panel.close();
                }
            });
        };

        this.downgrade = function(event) {
            Lacuna.confirm('Are you sure you want to downgrade your ' + event.data.vBuilding.name +
                ' to level ' + (parseInt(event.data.vBuilding.level) - 1) + '?',
            undefined, function(response) {
                // Once the user has confirmed that they actually
                // want to downgrade the building, do it!
                if (response) {
                    Lacuna.send({
                        module: event.data.url,
                        method: 'downgrade',
                        params: [{
                            'session_id'    : Lacuna.getSession(),
                            'building_id'   : event.data.vBuilding.id
                        }],
                        
                        success: function(o) {
                            // Close the panel.
                            event.data.panel.close(function() {
                                // nothing to do, building updates take care of themselves now
                            });
                        }
                    });
                }
            });
        };

        this.demolish = function(event) {
            Lacuna.confirm(
                'Are you sure you want to demolish your ' + event.data.vBuilding.name + '?',
            undefined, function(response) {
                if (response) {
                    Lacuna.send({
                        module: event.data.url,
                        method: 'demolish',
                        
                        params: [{
                            'session_id'    : Lacuna.getSession(),
                            'building_id'   : event.data.vBuilding.id
                        }],
                        
                        success: function(o) {
                            // Close the panel.
                            event.data.panel.close(function() {
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
