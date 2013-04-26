(function() {
	
	if (!$.Lacuna.MapPlanet || typeof($.Lacuna.MapPlanet) === 'undefined') {
		
		$.Lacuna.MapPlanet = {
			
			renderPlanet: function(id) {
				var buildingsTemplate = [];

				// So that this method can be treated as an 'update planet view'.
				id = id || $.Lacuna.GameData.Status.body.id;

				// Clear the intervals.
				this.clearBuildTimers();
				
				for (var x = -5; x < 6; x++) {
					for (var y = -5; y < 6; y++) {
						var idStr       = 'plot_' + x + '_' + y,
							idStrCenter = idStr + '_center';
						
						buildingsTemplate[buildingsTemplate.length] = [
							'<div id="', idStr, '" title="Ground" style="',
									'width: 100px;',
									'height: 100px;',
									'left: ', (parseInt(x) + 5) * 100, 'px;',
									'top: ', (parseInt(y) - 5) * 100 * -1, 'px;',
									'position: absolute;',
									'margin: 2px',
							'">',
							// Give it the build icon by defualt.
							'	<div id="', idStrCenter, '" style="display:none;">',
							'		<img id="build_icon" src="', window.assetsUrl, '/ui/l/build.png" style="',
										'position: absolute;',
										'width: 58px;',
										'height: 45px;',
										'top: 50%;',
										'left: 50%;',
										'margin-top: -22.5px;',
										'margin-left: -29px;',
							'		" />',
							'	</div>',
							'</div>'
						].join('');

						$('#buildingsParent').on({
							mouseenter: function(e) {
								// Display the pretty border.
								$('#' + e.data.borderEl).css({
									'border-style': 'dashed',
									'border-color': 'white',
									'border-width': '2px',
									'margin'      : '0px' // Stop the images jumping around.
								});

								// Then the level/build number/image.
								$('#' + e.data.centerEl).css('display', '');
							},
							mouseleave: function(e) {
								// Hide the border.
								$('#' + e.data.borderEl).css({
									'border-style': '',
									'border-color': '',
									'border-width': '',
									'margin'      : '2px' // Stop the images jumping around.
								});

								// Then the level/build number/image.
								$('#' + e.data.centerEl).css('display', 'none');
							},
							click: function(e) {
								// This bit is rather fun. If there's an item
								// in the this.buildings object thet matches
								// the selected plot, then the building view
								// panel will be opened. Otherwise, the plot
								// will be assumed empty, and the build panel
								// will be opened.
								
								if ($.Lacuna.MapPlanet.buildings[e.data.borderEl]) {
									// Open view panel.
									$.Lacuna.Building.view($.Lacuna.MapPlanet.buildings[e.data.borderEl]);
								}
								else {
									// Open build panel.
								}
							}
						}, '#' + idStr, {borderEl: idStr, centerEl: idStrCenter});
					}
				}
				
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
						$.Lacuna.GetSession(), // Session Id
						id // Body Id
					],
					
					success: function(o) {
						var buildings = o.result.buildings,
							body      = o.result.body;
							keys      = Object.keys(buildings);
							
						for (var i = 0; i < keys.length; i++) {
							var buildingId   = keys[i],
								building     = buildings[buildingId],
								idStr        = 'plot_' + parseInt(building.x) + '_' + parseInt(building.y),
								idStrCenter  = idStr + '_center',
								idStrCounter = idStr + '_counter',
								el           = $('#' + idStr);
								
							// Woopsie! Long line alert!!
							el.css('background', 'url(\'' + window.assetsUrl + '/planet_side/100/' + building.image + '.png\') no-repeat transparent');
							el.attr('title', building.name);

							el.html([
								// Only position the element if there's a build time to put in it.
								building.pending_build ? '<div id="' + idStrCounter + '" style="' +
									'font-family: impact;' +
									'color: white;' +
									'text-align: right;' +
									'font-size: 120%;' +
								'"></div>' : '',
								'<div id="', idStrCenter, '" style="',
									'display: none;',
									'position: absolute;',
									'width: 58px;',
									'height: 45px;',
									'top: 50%;',
									'left: 50%;',
									'margin-top: -22.5px;',
									'margin-left: -29px;',
									'color: white;',
									'font-size: 300%;',
									'font-weight: bold;',
									'font-family: impact;',
									'text-align: center;',
								'">',
									building.level,
								'</div>'
							].join(''));

							// Set up the build timer.
							if (building.pending_build) {
								$.Lacuna.MapPlanet.createBuildTimer(building.pending_build.seconds_remaining, idStrCounter);
							}

							// Check out the click handling of each tile above.
							$.Lacuna.MapPlanet.buildings[idStr] = building;
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
			},

			// Cache for the buildings rendered on the planet.
			buildings: {},
			// Cache for all the build timers that are set.
			intervals: {},


			// Then a few helper functions to make things work.
			// All of the build timer stuff needs to get moved to lacuna.js, sometime.
			createBuildTimer: function(seconds, targetEl) {
					var formattedTime = this.formatTime(seconds);
					$('#' + targetEl).html(formattedTime);

					var interval = setInterval(function() {
						seconds--;

						if (seconds === 0) {
							// Remove the timer.
							clearInterval(interval);

							// Refresh the planet.
							$.Lacuna.MapPlanet.renderPlanet();

							// Remove the interval from the log.
							delete this.intervals[interval];
						}
						else {
							formattedTime = $.Lacuna.MapPlanet.formatTime(seconds);
							$('#' + targetEl).html(formattedTime);
						}
					}, 1000);

					// Log the interval. For later destruction.
					this.intervals[interval] = 1;
				},

			// This was stolen straight from the original Lacuna Web Client.
			// I don't know how it works.
			formatTime: function(seconds) {
				if (seconds < 0) {
					return "";
				}
			
				var secondsInDay = 60 * 60 * 24,
					secondsInHour = 60 * 60,
					day = Math.floor(seconds / secondsInDay),
					hleft = seconds % secondsInDay,
					hour = Math.floor(hleft / secondsInHour),
					sleft = hleft % secondsInHour,
					min = Math.floor(sleft / 60),
					seconds = Math.floor(sleft % 60);
			
				if (day > 0) {
					return [day, hour, min, seconds].join(':');
				}
				else if (hour > 0) {
					return [hour, min, seconds].join(':');
				}
				else {
					return [min, seconds].join(':');
				}
			},
			clearBuildTimers: function() {
				var keys = Object.keys(this.intervals);

				for (var i = 0; i < keys.length; i++) {
					clearInterval(keys[i]);
				}
			}
		};
	}
})();