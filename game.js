(function() {
	
	if (!$.Lacuna.Game || typeof($.Lacuna.Game) === 'undefined') {
	
		$.Lacuna.Game = {
			BuildMainScreen: function() {
				// The Main screen doesn't contain very much. For the
				// moment, I'll only do the buildings view.
				
				$('#lacuna').html([
					'<div id="mainScreen">',
					'	<div id="buildingsParent" style="',
//						'width: 1500px;',
//						'height: 1500px',
					'">',
					'	</div>',
					'</div>'
				].join(''))
				
				// Now for the fun stuff.
				this.GetBuildings($.Lacuna.GameData.Status.empire.home_planet_id);
			},
			
			GetBuildings: function(planetId) {
				
				$.Lacuna.send({
					module: '/body',
					method: 'get_buildings',
					params: [
						$.Lacuna.GetSession(),
						planetId
					],
					
					success: function(o) {
						var buildings = o.result.buildings,
							body      = o.result.body;
							keys      = Object.keys(buildings),
							content   = [];
						
						for (var i = 0; i < keys.length; i++) {
							var buildingId = keys[i],
								building   = buildings[buildingId];
							
							content[content.length] = [
								'<div id="plot_', building.x, '_', building.y, '" style="',
									// Yes, I have long-line-itis. No, I'm not doing anything about it.
									'background: url(\'', window.assetsUrl, '/planet_side/100/', building.image, '.png\') no-repeat transparent;',
									'width: 100px;',
									'height: 100px;',
									'left: ', (parseInt(building.x) + 5) * 100, 'px;',
									'top: ', (parseInt(building.y) - 5) * 100 * -1, 'px;',
									'position: absolute;',
								'" title="', building.name, '">',
								'</div>'
							].join('');
						}
						
						$('#buildingsParent').html([
							'<div id="buildingsDraggableChild">',
								content.join(''),
							'</div>'
						].join('')).ready(function() {
							$('#buildingsDraggableChild').draggable({
								scroll: false
							});
						});
					}
				});
			}
		};
	}
})();