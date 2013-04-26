(function() {
	
	if (!$.Lacuna.Game || typeof($.Lacuna.Game) === 'undefined') {
	
		$.Lacuna.Game = {
			BuildMainScreen: function() {
				// The Main screen doesn't contain very much. For the
				// moment, I'll only do the buildings view.
				
				$('#lacuna').html([
					'<div id="mainScreen">',
					'	<div id="buildingsParent" style="',
						'cursor: url(\'' + window.assetsUrl + '/ui/web/openhand.cur\'), default;',
					'">',

					// TODO: Bottom section of the screen, with the
					// planet list and resource information of
					// the selected planet.
					'	</div>',
					'</div>'
				].join(''));
				
				// Now for the fun stuff.
				$.Lacuna.MapPlanet.renderPlanet($.Lacuna.GameData.Status.empire.home_planet_id);
			}
		};
	}
})();