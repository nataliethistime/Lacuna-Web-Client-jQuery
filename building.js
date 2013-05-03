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

						// In here will be the "get extra tabs" stuff.


						$.Lacuna.Building.panel = $.Lacuna.Panel.newTabbedPanel({
							draggable: true,
							name: building.name,
							preTabContent: $.Lacuna.Building.getBuildingHeader(building),

							tabs: tabs
						});
					}
				});
			}, 

			getBuildingHeader: function(building) {
				// TODO
				return 'Yes, this displays!!';
			},
			getViewTab: function(o) {
				var content = [],
					section1 = [], // Current Production
					section2 = [], // Upgrade Production
					section3 = []; // Upgrade Cost

				content[content.length] = [
					'<div id="currentProduction">',

					// Current Production
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
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.food_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/ore.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.ore_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/water.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.water_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/energy.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.energy_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/waste.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.waste_hour), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/happiness.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.production.happiness_hour), '/hr</span>',
					'		</li>',
					'	</ul>',
					'</div>',

					// Upgrade Cost
					'<div id="upgradeCost">',
					'	<ul class="noDot">',
					'		<li>Upgrade Cost</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/food.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.cost.food), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/ore.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.cost.ore), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/water.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.cost.water), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/energy.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.cost.energy), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/waste.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatNum(o.upgrade.cost.waste), '/hr</span>',
					'		</li>',
					'		<li>',
					'			<span class="small-img"><img src="', window.assetsUrl, '/ui/s/time.png" /></span>',
					'			<span class="building-details-num">', $.Lacuna.Library.formatTime(o.upgrade.cost.time), '</span>',
					'		</li>',
					'	</ul>',
					'</div>'
				].join('');

				return content;
			}
		};
	}
})();