define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
    
    template.load('building/planetaryCommand');

    function PlanetaryCommand() {
        this.getTabs = function() {
            return [
                {
                    name: 'Test 1',
                    content: template.read.building_planetary_command_test1()
                },
                {
                    name: 'Test 2',
                    content: template.read.building_planetary_command_test2()
                }
            ];
        };
    }

    return new PlanetaryCommand();
});
