(function() {
	
	if (!$.Lacuna.Building || typeof($.Lacuna.Building) === 'undefined') {

		$.Lacuna.Building = {
			view: function(building) {
				
				// Call building.view()
				$.Lacuna.send({
					module: building.url,
					method: 'view',
					params: [
						$.Lacuna.getSession(),
						building.id
					],

					success: function(o) {
						var tabs = [
							{
								name: 'View',
								content: $.Lacuna.Building.getViewTab(o.result.building)
							}
						];

						// Remove the leading slash.
						building.type = building.url.replace('/', '');
						
						var extraTabs = $.Lacuna.Building.buildings[building.type] ? 
							$.Lacuna.Building.buildings[building.type].getTabs() : [];

						// Put 'em together.
						if (extraTabs) {
							tabs = tabs.concat(extraTabs);
						}

						$.Lacuna.Building.panel = $.Lacuna.Panel.newTabbedPanel({
							draggable: true,
							name: building.name + ' ' + building.level,
							preTabContent: $.Lacuna.Building.getBuildingHeader(building),

							tabs: tabs
						});

						// Now that everything is on the screen, add in all the events.
						if (o.result.building.downgrade.can) {
							$(document.body).delegate(
								'#downgradeButton_' + building.id,
								'click',
								{
									building: o.result.building,
									url: building.url,
									panel: $.Lacuna.Building.panel
								},
								$.Lacuna.Building.downgrade
							);
						}

						if (o.result.building.upgrade.can) {
							$(document.body).delegate(
								'#upgradeButton_' + building.id,
								'click',
								{
									building: o.result.building,
									url: building.url,
									panel: $.Lacuna.Building.panel
								},
								$.Lacuna.Building.upgrade
							);
						}

						$(document.body).delegate(
							'#demolishButton_' + building.id,
							'click',
							{
								building: o.result.building,
								url: building.url,
								panel: $.Lacuna.Building.panel
							},
							$.Lacuna.Building.demolish
						);
					}
				});
			}, 

			getBuildingHeader: function(building) {
				return [
					'<div id="buildingDetailsHeaderImage">',
					'	<div style=\'',
							'width: 100px;',
							'height: 100px;',
							'background-image: ', $('#lacuna').css('background-image'), ';',
							'border-style: solid;',
							'border-width: 1px;',
							'float: left;',
					'	\'>',
					'		<img src="', window.assetsUrl, '/planet_side/100/', building.image, '.png">',
					'	</div>',
					'</div>',
					'<div id="buildingDetailsHeaderText" style="margin-left:110px;height:100px;">',
						$.Lacuna.getBuildingDesc(building.url),
					'</div>'
				].join('');
			},
			getViewTab: function(o) {
				return [
					// Current Production
					'<div id="currentProduction">',
					'	<ul class="noDot">',
					'		<li>Current Production</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/food.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.food_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/ore.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.ore_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/water.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.water_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/energy.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.energy_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/waste.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.waste_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/happiness.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.happiness_hour), '/hr</span>',
					'		</li>',
					'		<li>' +
					'			<button type="button" class="wide" id="demolishButton_', o.id, '">Demolish</button>',
					'		</li>',
					'	</ul>',
					'</div>',

					// Upgrade Production
					'<div id="upgradeProduction">',
					'	<ul class="noDot">',
					'		<li>Upgrade Production</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/food.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.production.food_hour) > parseInt($.Lacuna.GameData.Status.body.food_hour) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.production.food_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/ore.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.production.ore_hour) > parseInt($.Lacuna.GameData.Status.body.ore_hour) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.production.ore_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/water.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.production.water_hour) > parseInt($.Lacuna.GameData.Status.body.water_hour) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.production.water_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/energy.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.production.energy_hour) > parseInt($.Lacuna.GameData.Status.body.energy_hour) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.production.energy_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/waste.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.waste_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/happiness.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.production.happiness_hour) > parseInt($.Lacuna.GameData.Status.body.happiness_hour) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.production.happiness_hour), '/hr</span>',
					'		</li>',
					o.downgrade.can ?
					'		<li>' +
					'			<button class="wide" type="button" id="downgradeButton_' + o.id + '">Downgrade to level ' + 
								(parseInt(o.level) - 1) + '</button>' +
					'		</li>' :
					'		<li>' +
					'			<div class="ui-state-highlight centerText wide">' + 
					'				<span class="bold wide">Unable to downgrade:</span><br />' + o.upgrade.reason[1] +
					'			</div>' +
					'		</li>',
					'	</ul>',
					'</div>',

					// Upgrade Cost
					'<div id="upgradeCost">',
					'	<ul class="noDot">',
					'		<li>Upgrade Cost</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/food.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.cost.food) > parseInt($.Lacuna.GameData.Status.body.food_storage) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.cost.food || 0), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/ore.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.cost.ore) > parseInt($.Lacuna.GameData.Status.body.ore_storage) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.cost.ore || 0), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/water.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.cost.water) > parseInt($.Lacuna.GameData.Status.body.water_storage) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.cost.water || 0), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/energy.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.cost.energy) > parseInt($.Lacuna.GameData.Status.body.energy_storage) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.cost.energy || 0), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/waste.png" /></span>',
					'			<span class="building-details-num',
									parseInt(o.upgrade.cost.waste) > parseInt($.Lacuna.GameData.Status.body.waste_capacity) - parseInt($.Lacuna.GameData.Status.body.waste_storage) ? ' low-resource">' : '">',
									$.Lacuna.Library.formatNum(o.upgrade.cost.waste || 0), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/time.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatTime(o.upgrade.cost.time || 15), '</span>',
					'		</li>',
					o.upgrade.can ?
					'		<li>' +
					'			<button type="button" class="wide" id="upgradeButton_' + o.id + '">Upgrade to level ' + 
								(parseInt(o.level) + 1) + '</button>' +
					'		</li>' :
					'		<li>' +
					'			<div class="ui-state-highlight centerText wide">' + 
					'				<span class="bold wide">Unable to upgrade:</span><br />' + o.upgrade.reason[1] +
					'			</div>' +
					'		</li>',
					'	</ul>',
					'</div>'
				].join('');
			},

			upgrade: function(e) {

				// TODO: As per the current Web Client there is a popup
				//       which warns users about accidentally upgrading a 
				//       building and using Halls. I do not like this
				//       aproach to the situation. Need to find a better way
				//       to show the warning but not bother the more experienced
				//       players with extra clicking.

				$.Lacuna.send({
					module: e.data.url,
					method: 'upgrade',

					params: [
						$.Lacuna.getSession(), // Session Id
						e.data.building.id
					],

					success: function(o) {
						// Close the panel.
						e.data.panel.close(function() {
							// Refresh planet.
							$.Lacuna.MapPlanet.renderPlanet();
						});
					}
				})
			},

			downgrade: function(e) {
				$.Lacuna.confirm('Are you sure you want to downgrade your ' + e.data.building.name
					+ ' to level ' + (parseInt(e.data.building.level) - 1) + '?',
					undefined, function(response) {
						
						// Once the user has confirmed that they actually
						// want to downgrade the building, do it!
						if (response) {
							
							$.Lacuna.send({
								module: e.data.url,
								method: 'downgrade',

								params: [
									$.Lacuna.getSession(), // Session Id
									e.data.building.id // Building Id
								],

								success: function(o) {
									// Close the panel.
									e.data.panel.close(function() {
										// Refresh planet.
										$.Lacuna.MapPlanet.renderPlanet();
									});
								}
							})
						}
				});
			},

			demolish: function(e) {
				$.Lacuna.confirm(
					'Are you sure you want to demolish your ' + e.data.building.name + '?',
					undefined, function(response) {
						if (response) {

							$.Lacuna.send({
								module: e.data.url,
								method: 'demolish',

								params: [
									$.Lacuna.getSession(), // Session Id
									e.data.building.id // Building Id
								],

								success: function(o) {
									// Close the panel.
									e.data.panel.close(function() {
										// Refresh planet.
										$.Lacuna.MapPlanet.renderPlanet();
									});
								}
							})
						}
					});
			},

			// Object of all the implemnted buildings in the Client so far.
			// This is used above in deciding what to do when a user clicks
			// on a particular building.
			buildings: {
				'planetarycommand' : $.Lacuna.PlanetaryCommand
			}
		};
	}
})();