(function() {
	if (!$.Lacuna.PlanetaryCommand || typeof($.Lacuna.PlanetaryCommand) === 'undefined') {
		$.Lacuna.PlanetaryCommand = {
			getTabs: function() {
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
			}
		};
	}
})();