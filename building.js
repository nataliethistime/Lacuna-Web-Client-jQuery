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
					'<div id="buildingDetailsHeaderText" style="margin-left: 110px;">',
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
					'	</ul>',
					'</div>'
				].join('');
			},

			// Object of all the implemnted buildings in the Client so far.
			// This is used above in deciding what to when a user clicks
			// on a particular building.
			buildings: {
				'planetarycommand' : $.Lacuna.PlanetaryCommand
			}
		};
	}
})();