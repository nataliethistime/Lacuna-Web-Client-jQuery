(function() {
	
	if (!$.Lacuna.Game || typeof($.Lacuna.Game) === 'undefined') {
	
		$.Lacuna.Game = {
			BuildMainScreen: function() {
				// The Main screen doesn't contain very much. For the
				// moment, I'll only do the buildings view.
				
				$('#lacuna').html([
					'<div id="mainScreen">',
					'	<div id="buildingsParent">',
					'	</div>',
					'</div>'
				].join(''))
				
				// Now for the fun stuff.
				this.getBuildings($.Lacuna.GameData.Status.empire.home_planet_id);
			},
			
			getBuildings: function(id) {
				var buildingsTemplate = [];
				for (var x = -5; x < 6; x++) {
					for (var y = -5; y < 6; y++) {
						buildingsTemplate[buildingsTemplate.length] = [
							'<div id="plot_', x, '_', y, '" title="Ground" style="',
									'width: 100px;',
									'height: 100px;',
									'left: ', (parseInt(x) + 5) * 100, 'px;',
									'top: ', (parseInt(y) - 5) * 100 * -1, 'px;',
									'position: absolute;',
							'">',
							'</div>'
						].join('');
					}
				}
				//console.log(buildingsTemplate.join('\n'));//debug
				
				// Send it to the DOM.
				$('#buildingsParent').html([
					'<div id="buildingsDraggableChild">',
					buildingsTemplate.join(''),
					'</div>'
				].join(''));
				
				// Right, now that that's out of the way, onward we must go...
				$.Lacuna.send({
					module: '/body',
					method: 'get_buildings',
					params: [
						$.Lacuna.GetSession(),
						id
					],
					
					success: function(o) {
						var buildings = o.result.buildings,
							body      = o.result.body;
							keys      = Object.keys(buildings),
							content   = [];
							
						for (var i = 0; i < keys.length; i++) {
							var buildingId = keys[i],
								building   = buildings[buildingId]
								el         = $('#plot_' + parseInt(building.x) + '_' + parseInt(building.y));
								
							// Woopsie! Long line alert!!
							el.css('background', 'url(\'' + window.assetsUrl + '/planet_side/100/' + building.image + '.png\') no-repeat transparent');
							el.attr('title', building.name);
						}
						
						$('#lacuna').css({
							'background-image' : 'url(\'' + window.assetsUrl + '/planet_side/' + body.surface_image + '.jpg\')'
						});
						
						// Start the Draggable.
						$('#buildingsDraggableChild').draggable({
							scroll: false
						});
					}
				});
			}
		};
	}
})();