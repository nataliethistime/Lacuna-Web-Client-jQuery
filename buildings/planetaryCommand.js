define(['jquery', 'lacuna'], function($, Lacuna) {
	
	function PlanetaryCommand() {
		this.getTabs = function() {
			return [
				{
					name: 'test 1',
					content: 'hiya'
				},
				{
					name: 'test 2',
					content: 'coolio'
				}
			];
		};
	}

	return new PlanetaryCommand();
});