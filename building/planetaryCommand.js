define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {
	
    Template.load('building/planetaryCommand');

	function PlanetaryCommand() {
		this.getTabs = function() {
			return [
				{
					name: 'test 1',
					content: Template.read.building_planetary_command_test1()
				},
				{
					name: 'test 2',
					content: Template.read.building_planetary_command_test2()
				}
			];
		};
	}

	return new PlanetaryCommand();
});