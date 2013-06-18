
define(['jquery', 'lacuna', 'template', 'body', 'library'], function($, Lacuna, Template, Body, Library) {
    Template.load(['building/wastesequestration']);
    function WasteSequestration() {
        var scope = this;

        scope.getTabs = function(vBuilding, url) {
            console.log(this);//debug
            return [
                {
                    name: 'Storage',
                    content: scope.getStorageTab(vBuilding)
                },
            ];
        };

        scope.getStorageTab = function(vBuilding) {
            var currentStorage = Template.read.building_waste_sequestration_current_storage({
                assets_url:             window.assetsUrl,
                building_id:            vBuilding.id,
                food_capacity:          Library.formatNum(vBuilding.food_capacity),
                ore_capacity:           Library.formatNum(vBuilding.ore_capacity),
                water_capacity:         Library.formatNum(vBuilding.water_capacity),
                energy_capacity:        Library.formatNum(vBuilding.energy_capacity),
                waste_capacity:         Library.formatNum(vBuilding.waste_capacity),
            });
            var upgradeStorage = Template.read.building_waste_sequestration_upgrade_storage({
                assets_url:                 window.assetsUrl,
                building_id:                vBuilding.id,
                food_capacity_upgrade:      Library.formatNum(vBuilding.upgrade.production.food_capacity),
                ore_capacity_upgrade:       Library.formatNum(vBuilding.upgrade.production.ore_capacity),
                water_capacity_upgrade:     Library.formatNum(vBuilding.upgrade.production.water_capacity),
                energy_capacity_upgrade:    Library.formatNum(vBuilding.upgrade.production.energy_capacity),
                waste_capacity_upgrade:     Library.formatNum(vBuilding.upgrade.production.waste_capacity),
            });

            return [
                currentStorage,
                upgradeStorage
            ].join('');
        };

        scope.addEvents = function(vBuilding, url) {
        };
    }

    return new WasteSequestration();
});
