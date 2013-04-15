$(document).ready(function() {

	$('#lacuna').append([
		'<div id="loadingScreen">',
		'	<img src="assets/logo.png" id="loadingImage" alt="Lacuna Expanse is Loading..." />',
		'	<div id="loadingProgressBar" style="height: 25px;">',
		'		<div id="loadingProgressBarMessage" style="position: absolute; float: left; margin-left: 25px; margin-top: 5px;"></div>',
		'	</div>',
		'</div>'
	].join('')).ready(function() {
	
		$('#loadingProgressBar').progressbar({
			value: 1,
			
			complete: function(event, ui) {
				Lacuna.debug('Loading completed.');
				$('#loadingProgressBarMessage').html('Welcome!!');
				
				setTimeout(function() {
					// Fade out and destroy the Loading Screen.
					$('#loadingScreen').fadeOut(500, function() {
						$('#loadingScreen').remove();
						
						Lacuna.Login.build();
					});
				}, 1000); // So that the 'Welcome!!' is visible. :)
			}
		});
		
		// Begin loading.
		loadModule('lacuna.js');
		loadModule('login.js');
	
	});
});

var loadedModules = 0;
function loadModule(name, successFunction) {
	// $.getScript() only accepts full URLS.
	var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
	
	$.getScript(url + name).done(function() {
		if (typeof(Lacuna) === 'object') {
			Lacuna.debug('Correctly loaded ' + name + ' at ' + url + '.');
		}
		else {
			console.log('Correctly loaded ' + name + ' at ' + url + '.');
		}
		
		if (successFunction) {
			successFunction();
		}
		
		loadedModules++;
		var percent = (loadedModules / 2) * 100; // 2 being the number of modules to load.
		
		$("#loadingProgressBar .ui-progressbar-value").animate({
			width: percent + '%'
		}, 500, function() {
			$('#loadingProgressBarMessage').html(percent + '% - ' + makeRandomMessage()); // TODO: Make this look prettier!
			$('#loadingProgressBar').progressbar({value: percent}); // Register the percent change.
		});
		
	}).fail(function() {
		if (typeof(Lacuna) === 'object') {
			Lacuna.debug('Failed to load ' + name + ' at ' + url + '.');
		}
		else {
			console.log('Failed to load ' + name + ' at ' + url + '.');
		}
	});
}

function makeRandomMessage() {
	var messages = [
		'loading ships',
		'starting engines',
		'breaking atmo',
		'calculating trajectory',
		'engaging hyper drive',
		'travelling the verse',
		'other witty comments',
		'reticulating splines',
		'compacting nebulas',
		'colliding asteroids',
		'corroding spreadsheets',
		'irradiating pneumatic systems',
		'constructing universe',
		'detonating luggage',
		'harvesting politicians',
		'inflating government structure',
		'discrediting liquids',
		'camoflaging nerds',
		'vilifying heroes',
		'flooding prairies',
		'nebulizing nebulas',
		'spinning plates',
		'fortifying bread',
		'lambasting vampires',
		'elevating vectors',
		'caching favors',
		'predicting history',
		'looking suave',
		'babelizing translations',
		'necrotizing decimals',
		'capitalizing numerals',
		'compressing water',
		'reliving the past',
		'delivering ingots',
		'bottling particles',
		'refactoring physics',
		'cavitating airflow',
		'corrupting time stream',
		'unbalancing gyroscopes',
		'fishing for compliments',
		'refuting evidence',
		'rotating pinions',
		'engaging clutch',
		'ejecting pilot',
		'reciting poetry',
		'investigating rumors',
		'deconstructing philosophies',
		'monetizing colors',
		'digitizing electrolytes',
		'motivating livestock',
		'assuming the worst',
		'ignoring mummies',
		'disconnecting engineers',
		'remembering the future',
		'broadcasting the truth',
		'entertaining the possibility',
		'developing a theory',
		'making friends',
		'oxidizing lizards',
		'coercing automatons',
		'dissociating ions',
		'taking a break',
		'watching paint dry',
		'decanting the clones',
		'motoring movers',
		'scaping goats',
		'assembling deployments',
		'deploying assemblages',
		'taking candy from a baby',
		'turning water into wine',
		'making it go',
		'spelunking for camels',
		'perambulating procedures',
		'kicking the tires',
		'setting launch codes',
		'defining reality',
		'making a list',
		'checking it twice',
		'delving into the unthinkable',
		'doing the impossible',
		'pushing the button'
	];
	
	// Just keep generating the number until it's in range.
	var number;
	do {
		number = Math.floor((Math.random()*100) + 1);
	} while (number > messages.length)
	
	return messages[number];
}