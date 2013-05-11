define([
// Modules
'jquery', 'lacuna', 'mapPlanet', 'library',

// Buildings
'buildings/planetaryCommand'], function(
$, Lacuna, MapPlanet, Library,
PlanetaryCommand) {
    function Building() {

        this.view = function(building) {
            Lacuna.send({
                module: building.url,
                method: 'view',
                params: [
                Lacuna.getSession(), // Session Id
                building.id // Building Id
                ],

                success: function(o) {
                    var tabs = [{
                        name: 'View',
                        content: this.getViewTab(o.result.building)
                    }];

                    // Remove the leading slash.
                    building.type = building.url.replace('/', '');
                    var extraTabs = this.buildings[building.type] ? this.buildings[building.type].getTabs() : [];

                    // Put 'em together.
                    if (extraTabs) {
                        tabs = tabs.concat(extraTabs);
                    }

                    this.panel = Lacuna.Panel.newTabbedPanel({
                        draggable: true,
                        name: building.name + ' ' + building.level,
                        preTabContent: this.getBuildingHeader(building),
                        tabs: tabs
                    });

                    // Now that everything is on the screen, add in all the events.
                    if (o.result.building.downgrade.can) {
                        $('#downgradeButton_' + building.id).on(
                            'click', {
                            building: o.result.building,
                            url: building.url,
                            panel: this.panel
                        },
                        this.downgrade);
                    }

                    if (o.result.building.upgrade.can) {
                        $('#upgradeButton_' + building.id).on(
                            'click', {
                            building: o.result.building,
                            url: building.url,
                            panel: this.panel
                        },
                        this.upgrade);
                    }

                    $('#demolishButton_' + building.id).on(
                        'click', {
                        building: o.result.building,
                        url: building.url,
                        panel: this.panel
                    },
                    this.demolish);
                },
                scope: this
            });
        };

        this.getBuildingHeader = function(building) {
            return Lacuna.Templates.tmpl_building_header({
                background_image: $('#lacuna').css('background-image'),
                assets_url: window.assetsUrl,
                building_image: building.image,
                building_desc: Lacuna.getBuildingDesc(building.url)
            });
        };

        this.getViewTab = function(o) {
            var currentProduction = Lacuna.Templates.tmpl_building_current_production({
                assets_url: window.assetsUrl,
                food_hour: Library.formatNum(o.food_hour),
                ore_hour: Library.formatNum(o.ore_hour),
                water_hour: Library.formatNum(o.water_hour),
                energy_hour: Library.formatNum(o.energy_hour),
                waste_hour: Library.formatNum(o.waste_hour),
                happiness_hour: Library.formatNum(o.happiness_hour),
                building_id: o.id
            });
            var upgradeProduction = Lacuna.Templates.tmpl_building_upgrade_production({
                assets_url: window.assetsUrl,
                up_food_hour: Library.formatNum(o.upgrade.production.food_hour),
                up_ore_hour: Library.formatNum(o.upgrade.production.ore_hour),
                up_water_hour: Library.formatNum(o.upgrade.production.water_hour),
                up_energy_hour: Library.formatNum(o.upgrade.production.energy_hour),
                up_waste_hour: Library.formatNum(o.upgrade.production.waste_hour),
                up_happy_hour: Library.formatNum(o.upgrade.production.happiness_hour),
                up_food_bad: parseInt(o.upgrade.production.food_hour) > parseInt(Lacuna.GameData.Status.body.food_hour),
                up_ore_bad: parseInt(o.upgrade.production.ore_hour) > parseInt(Lacuna.GameData.Status.body.ore_hour),
                up_water_bad: parseInt(o.upgrade.production.water_hour) > parseInt(Lacuna.GameData.Status.body.water_hour),
                up_energy_bad: parseInt(o.upgrade.production.energy_hour) > parseInt(Lacuna.GameData.Status.body.energy_hour),
                up_happy_bad: parseInt(o.upgrade.production.happiness_hour) > parseInt(Lacuna.GameData.Status.body.happiness_hour),
                building_id: o.id,
                to_level: parseInt(o.level) - 1,
                downgrade_reason: o.downgrade.reason[1],
                can_downgrade: o.downgrade.can
            });
            var upgradeCost = Lacuna.Templates.tmpl_building_upgrade_cost({
                assets_url: window.assetsUrl,
                up_food_cost: Library.formatNum(o.upgrade.cost.food || 0),
                up_ore_cost: Library.formatNum(o.upgrade.cost.ore || 0),
                up_water_cost: Library.formatNum(o.upgrade.cost.water || 0),
                up_energy_cost: Library.formatNum(o.upgrade.cost.energy || 0),
                up_waste_cost: Library.formatNum(o.upgrade.cost.waste || 0),
                up_time_cost: Library.formatNum(o.upgrade.cost.time || 15),
                up_food_bad: parseInt(o.upgrade.cost.food) > parseInt(Lacuna.GameData.Status.body.food_storage),
                up_ore_bad: parseInt(o.upgrade.cost.ore) > parseInt(Lacuna.GameData.Status.body.ore_storage),
                up_water_bad: parseInt(o.upgrade.cost.water) > parseInt(Lacuna.GameData.Status.body.water_storage),
                up_energy_bad: parseInt(o.upgrade.cost.energy) > parseInt(Lacuna.GameData.Status.body.energy_storage),
                up_waste_bad: parseInt(o.upgrade.cost.waste) > parseInt(Lacuna.GameData.Status.body.waste_storage),
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
            // aproach to the situation. Need to find a better way
            // to show the warning but not bother the more experienced
            // players with extra clicking.

            Lacuna.send({
                module: e.data.url,
                method: 'upgrade',

                params: [
                    Lacuna.getSession(), // Session Id
                    e.data.building.id
                ],
                
                success: function(o) {
                    // Close the panel.
                    e.data.panel.close(function() {
                        // Refresh planet.
                        Lacuna.MapPlanet.renderPlanet();
                    });
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
                            Lacuna.getSession(), // Session Id
                            e.data.building.id // Building Id
                        ],
                        
                        success: function(o) {
                            // Close the panel.
                            e.data.panel.close(function() {
                                // Refresh planet.
                                MapPlanet.renderPlanet();
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
                            Lacuna.getSession(), // Session Id
                            e.data.building.id // Building Id
                        ],
                        
                        success: function(o) {
                            // Close the panel.
                            e.data.panel.close(function() {
                                // Refresh planet.
                                MapPlanet.renderPlanet();
                            });
                        }
                    });
                }
            });
        };
        
        this.buildings = {
            'planetarycommand': PlanetaryCommand
        };
    }
    
    return new Building();
});