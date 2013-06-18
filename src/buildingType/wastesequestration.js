
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
                {
                    name: 'Details',
                    content: scope.getDetailsTab(vBuilding)
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
                assets_url:             window.assetsUrl,
                building_id:            vBuilding.id,
                // Icy says there's currently no easy way to get these; 
                // leaving bogus until that's decided.
                food_capacity_next:     Library.formatNum(1),
                ore_capacity_next:      Library.formatNum(1),
                water_capacity_next:    Library.formatNum(1),
                energy_capacity_next:   Library.formatNum(1),
                waste_capacity_next:    Library.formatNum(1),
            });

            return [
                currentStorage,
                upgradeStorage
            ].join('');
        };

        scope.getDetailsTab = function(vBuilding) {
            var details = Template.read.building_waste_sequestration_details({
                assets_url:     window.assetsUrl,
                building_id:    vBuilding.id,
            });
            return [
                details,
            ].join('');
        };

        scope.addEvents = function(vBuilding, url) {
        };
    }

    return new WasteSequestration();
});
