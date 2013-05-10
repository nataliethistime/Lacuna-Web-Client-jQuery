(function() {
    
    if (!$.Lacuna.Building || typeof($.Lacuna.Building) === 'undefined') {

        $.Lacuna.Building = {
            view: function(building) {
                
                // Call building.view()
                $.Lacuna.send({
                    module: building.url,
                    method: 'view',
                    params: [
                        $.Lacuna.getSession(),
                        building.id
                    ],

                    success: function(o) {
                        var tabs = [
                            {
                                name: 'View',
                                content: $.Lacuna.Building.getViewTab(o.result.building)
                            }
                        ];

                        // Remove the leading slash.
                        building.type = building.url.replace('/', '');
                        
                        var extraTabs = $.Lacuna.Building.buildings[building.type] ? 
                            $.Lacuna.Building.buildings[building.type].getTabs() : [];

                        // Put 'em together.
                        if (extraTabs) {
                            tabs = tabs.concat(extraTabs);
                        }

                        $.Lacuna.Building.panel = $.Lacuna.Panel.newTabbedPanel({
                            draggable: true,
                            name: building.name + ' ' + building.level,
                            preTabContent: $.Lacuna.Building.getBuildingHeader(building),

                            tabs: tabs
                        });

                        // Now that everything is on the screen, add in all the events.
                        if (o.result.building.downgrade.can) {
                            $(document.body).delegate(
                                '#downgradeButton_' + building.id,
                                'click',
                                {
                                    building: o.result.building,
                                    url: building.url,
                                    panel: $.Lacuna.Building.panel
                                },
                                $.Lacuna.Building.downgrade
                            );
                        }

                        if (o.result.building.upgrade.can) {
                            $(document.body).delegate(
                                '#upgradeButton_' + building.id,
                                'click',
                                {
                                    building: o.result.building,
                                    url: building.url,
                                    panel: $.Lacuna.Building.panel
                                },
                                $.Lacuna.Building.upgrade
                            );
                        }

                        $(document.body).delegate(
                            '#demolishButton_' + building.id,
                            'click',
                            {
                                building: o.result.building,
                                url: building.url,
                                panel: $.Lacuna.Building.panel
                            },
                            $.Lacuna.Building.demolish
                        );
                    }
                });
            }, 

            getBuildingHeader: function(building) {
                return $.Lacuna.templates.tmpl_building_header({
                    background_image    : $('#lacuna').css('background-image'),
                    assets_url          : window.assetsUrl,
                    building_image      : building.image,
                    building_desc       : $.Lacuna.getBuildingDesc(building.url)
                });
            },
            getViewTab: function(o) {
                var currentProduction = $.Lacuna.templates.tmpl_building_current_production({
                    assets_url          : window.assetsUrl,
                    food_hour           : $.Lacuna.Library.formatNum(o.food_hour),
                    ore_hour            : $.Lacuna.Library.formatNum(o.ore_hour),
                    water_hour          : $.Lacuna.Library.formatNum(o.water_hour),
                    energy_hour         : $.Lacuna.Library.formatNum(o.energy_hour),
                    waste_hour          : $.Lacuna.Library.formatNum(o.waste_hour),
                    happiness_hour      : $.Lacuna.Library.formatNum(o.happiness_hour),
                    building_id         : o.id
                });

                var upgradeProduction = $.Lacuna.templates.tmpl_building_upgrade_production({
                    assets_url          : window.assetsUrl,
                    up_food_hour        : $.Lacuna.Library.formatNum(o.upgrade.production.food_hour),
                    up_ore_hour         : $.Lacuna.Library.formatNum(o.upgrade.production.ore_hour),
                    up_water_hour       : $.Lacuna.Library.formatNum(o.upgrade.production.water_hour),
                    up_energy_hour      : $.Lacuna.Library.formatNum(o.upgrade.production.energy_hour),
                    up_waste_hour       : $.Lacuna.Library.formatNum(o.upgrade.production.waste_hour),                   
                    up_happy_hour       : $.Lacuna.Library.formatNum(o.upgrade.production.happiness_hour),
                    up_food_bad         : parseInt(o.upgrade.production.food_hour) > parseInt($.Lacuna.GameData.Status.body.food_hour),
                    up_ore_bad          : parseInt(o.upgrade.production.ore_hour) > parseInt($.Lacuna.GameData.Status.body.ore_hour),
                    up_water_bad        : parseInt(o.upgrade.production.water_hour) > parseInt($.Lacuna.GameData.Status.body.water_hour),
                    up_energy_bad       : parseInt(o.upgrade.production.energy_hour) > parseInt($.Lacuna.GameData.Status.body.energy_hour),
                    up_happy_bad        : parseInt(o.upgrade.production.happiness_hour) > parseInt($.Lacuna.GameData.Status.body.happiness_hour),
                    building_id         : o.id,
                    to_level            : parseInt(o.level) - 1,
                    downgrade_reason    : o.downgrade.reason[1],
                    can_downgrade       : o.downgrade.can
                });
                var upgradeCost = $.Lacuna.templates.tmpl_building_upgrade_cost({
                    assets_url          : window.assetsUrl,
                    up_food_cost        : $.Lacuna.Library.formatNum(o.upgrade.cost.food),
                    up_ore_cost         : $.Lacuna.Library.formatNum(o.upgrade.cost.ore),
                    up_water_cost       : $.Lacuna.Library.formatNum(o.upgrade.cost.water),
                    up_energy_cost      : $.Lacuna.Library.formatNum(o.upgrade.cost.energy),
                    up_waste_cost       : $.Lacuna.Library.formatNum(o.upgrade.cost.waste),
                    up_time_cost        : $.Lacuna.Library.formatNum(o.upgrade.cost.time) || 15,
                    up_food_bad         : parseInt(o.upgrade.cost.food) > parseInt($.Lacuna.GameData.Status.body.food_storage),
                    up_ore_bad          : parseInt(o.upgrade.cost.ore) > parseInt($.Lacuna.GameData.Status.body.ore_storage),
                    up_water_bad        : parseInt(o.upgrade.cost.water) > parseInt($.Lacuna.GameData.Status.body.water_storage),
                    up_energy_bad       : parseInt(o.upgrade.cost.energy) > parseInt($.Lacuna.GameData.Status.body.energy_storage),
                    up_waste_bad        : parseInt(o.upgrade.cost.waste) > parseInt($.Lacuna.GameData.Status.body.waste_storage),
                    building_id         : o.id,
                    to_level            : parseInt(o.level) + 1,
                    upgrade_reason      : o.upgrade.reason[1],
                    can_upgrade         : o.upgrade.can
                });

                return [
                    currentProduction,
                    upgradeProduction,
                    upgradeCost
                ].join('');
            },

            upgrade: function(e) {

                // TODO: As per the current Web Client there is a popup
                //       which warns users about accidentally upgrading a 
                //       building and using Halls. I do not like this
                //       aproach to the situation. Need to find a better way
                //       to show the warning but not bother the more experienced
                //       players with extra clicking.

                $.Lacuna.send({
                    module: e.data.url,
                    method: 'upgrade',

                    params: [
                        $.Lacuna.getSession(), // Session Id
                        e.data.building.id
                    ],

                    success: function(o) {
                        // Close the panel.
                        e.data.panel.close(function() {
                            // Refresh planet.
                            $.Lacuna.MapPlanet.renderPlanet();
                        });
                    }
                })
            },

            downgrade: function(e) {
                $.Lacuna.confirm('Are you sure you want to downgrade your ' + e.data.building.name
                    + ' to level ' + (parseInt(e.data.building.level) - 1) + '?',
                    undefined, function(response) {
                        
                        // Once the user has confirmed that they actually
                        // want to downgrade the building, do it!
                        if (response) {
                            
                            $.Lacuna.send({
                                module: e.data.url,
                                method: 'downgrade',

                                params: [
                                    $.Lacuna.getSession(), // Session Id
                                    e.data.building.id // Building Id
                                ],

                                success: function(o) {
                                    // Close the panel.
                                    e.data.panel.close(function() {
                                        // Refresh planet.
                                        $.Lacuna.MapPlanet.renderPlanet();
                                    });
                                }
                            })
                        }
                });
            },

            demolish: function(e) {
                $.Lacuna.confirm(
                    'Are you sure you want to demolish your ' + e.data.building.name + '?',
                    undefined, function(response) {
                        if (response) {

                            $.Lacuna.send({
                                module: e.data.url,
                                method: 'demolish',

                                params: [
                                    $.Lacuna.getSession(), // Session Id
                                    e.data.building.id // Building Id
                                ],

                                success: function(o) {
                                    // Close the panel.
                                    e.data.panel.close(function() {
                                        // Refresh planet.
                                        $.Lacuna.MapPlanet.renderPlanet();
                                    });
                                }
                            })
                        }
                    });
            },

            // Object of all the implemnted buildings in the Client so far.
            // This is used above in deciding what to do when a user clicks
            // on a particular building.
            buildings: {
                'planetarycommand' : $.Lacuna.PlanetaryCommand
            }
        };
    }
})();