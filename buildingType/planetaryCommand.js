define(['jquery', 'lacuna', 'template'], function($, lacuna, template) {
	
    template.load('building/planetaryCommand');

	function PlanetaryCommand() {
		this.getTabs = function() {
			return [
				{
					name: 'test 1',
					content: template.read.building_planetary_command_test1()
				},
				{
					name: 'test 2',
					content: template.read.building_planetary_command_test2()
				}
			];
		};
	}

	return new PlanetaryCommand();
});