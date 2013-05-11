define(['jquery', 'lacuna', 'mapPlanet', 'login'], function($, Lacuna, MapPlanet, Login) {
	
	function Game() {
		this.buildMainScreen = function() {
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
			MapPlanet.renderPlanet(Lacuna.GameData.Status.empire.home_planet_id);
		};

		this.start = function() {
			Lacuna.Panel.panelWidth = 800/*px*/;
			// A Panel's height can be decided manually or left up to jQuery.

			var url = window.location.protocol + 
				'//' + 
				window.location.hostname + 
				window.location.pathname + 
				'resources.json';
			$.getJSON(url, function(json) {
				Lacuna.Resources = json;
			});

			// Open the login screen.
			Login.build();
		};
	}

	return new Game();
});