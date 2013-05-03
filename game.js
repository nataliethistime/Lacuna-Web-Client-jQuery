(function() {
	
	if (!$.Lacuna.Game || typeof($.Lacuna.Game) === 'undefined') {
	
		$.Lacuna.Game = {
			BuildMainScreen: function() {
				// The Main screen doesn't contain very much. For the
				// moment, I'll only do the buildings view.
				
				$('#lacuna').html([
					'<div id="mainScreen">',
					'	<div id="gameHeader" style="background-image: url(\'',window.assetsUrl, '/ui/web/bar_top_back.png\')">',
					'		', //TODO
					'	</div>',
					'	<div id="buildingsParent" style="',
						'cursor: url(\'' + window.assetsUrl + '/ui/web/openhand.cur\'), default;',
					'">',
					'	</div>',
					'	<div id="gameFooter" style="background-image: url(\'',window.assetsUrl, '/ui/web/bar_bottom_back.png\')">',
					'		',//TODO
					'	</div>',
					'</div>'
				].join(''));
				
				// Now for the fun stuff.
				$.Lacuna.MapPlanet.renderPlanet($.Lacuna.GameData.Status.empire.home_planet_id);
			},
			// Does some stuff, opens the login Panel.
			Start: function() {
				$.Lacuna.Panel.panelWidth = 800/*px*/;
				// A Panel's height can be decided manually or left up to jQuery.

				// Load resources.json for later use.
				// TODO!

				// Open the login screen.
				$.Lacuna.Login.build();
			}
		};
	}
})();