(function() {
	
	if (!$.Lacuna.Building || typeof($.Lacuna.Building) === 'undefined') {

		$.Lacuna.Building = {
			view: function(building) {
				// Confirm that the data is getting passed in correctly.
				$.Lacuna.alert('Coolness<br />' + JSON.stringify(building));
			}
		};
	}
})();