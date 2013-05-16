define(['jquery', 'lacuna', 'template'], function($, lacuna, template) {
	
	function DefaultBuilding() {
		this.getTabs = function() {
            return [];
		};
	}

	return new DefaultBuilding();
});