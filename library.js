(function() {
	if (!$.Lacuna.Library || typeof($.Lacuna.Library) === 'undefined') {
		$.Lacuna.Library = {

			// Best function in the world, trust me. :P
			elExists: function(name) {
				return $('#' + name).length > 0;
			}
		};
	}
})();