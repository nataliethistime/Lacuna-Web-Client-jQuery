define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    Template.load('building/planetaryCommand');

    function PlanetaryCommand() {
        this.getTabs = function() {
            return [
                {
                    name: 'Test 1',
                    content: Template.read.building_planetary_command_test1()
                },
                {
                    name: 'Test 2',
                    content: Template.read.building_planetary_command_test2()
                }
            ];
        };
    }

    return new PlanetaryCommand();
});
