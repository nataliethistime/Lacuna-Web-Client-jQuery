$(document).ready(function() {

    // This snippet prevents the user from navigating to
    // one of the tabs that was on the screen when they 
    // would've hit "F5" on their keyboard.
    // When they do this, there's a lot of funk happening,
    // so, I've found it's best to just remove the hash
    // and load afresh.
    if (window.location.hash != '') {
        var newUrl = window.location.protocol + 
                     '//'                     +
                     window.location.hostname + 
                     (window.location.pathname || '') +
                     (window.location.search   || '');
        window.location.href = newUrl; // Automatically refreshes.
        window.location.hash = ''; // Remove the hash to prevent infate looping.
    }

    // NOTE: this method affects **ALL** Ajax calls!
    // We *must* make all AJAX calls asyncronous otherwise it will affect the user experience.
    $.ajaxSetup({
        async: false, // Need to do this or loading gets messed up sometimes.
    });
    $.support.cors = true;

    // Create the URL for use within the client.
    if (typeof(window.serverUrl) != 'undefined') {
        window.url = window.serverUrl;
    }
    else {
        window.url = window.location.protocol + '//' + window.server+ '.lacunaexpanse.com';
    }
    
    // We can't put this in a template, since we have not loaded them yet!
    $('#lacuna').append([
        '<div id="loadingScreen">',
        '    <img src="assets/logo.png" id="loadingImage" alt="Lacuna Expanse is Loading..." />',
        '    <div id="loadingProgressBar" style="height: 25px;">',
        '        <div id="loadingProgressBarMessage" style="position: absolute; float: left; margin-left: 25px; margin-top: 5px;"></div>',
        '    </div>',
        '</div>'
    ].join('')).ready(function() {

        $('#loadingProgressBar').progressbar({
            value: 1,
        
            complete: function(event, ui) {
                $.Lacuna.debug('Loading completed.');
                $('#loadingProgressBarMessage').html('Welcome!!');
                
                setTimeout(function() {
                    // Fade out and destroy the Loading Screen.
                    $('#loadingScreen').fadeOut(500, function() {
                        $('#loadingScreen').remove();
                        
                        $.Lacuna.Game.start();
                    });
                }, 1000); // So that the 'Welcome!!' is visible. :)
            }
        });
       
        // Core functions.
        loadModule('lacuna.js');
        loadModule('game.js');
        loadModule('mapPlanet.js');
        loadModule('library.js');
        
        // Interface items.
        loadModule('login.js');
        
        // Buildings
        loadModule('buildings/planetaryCommand.js');
        
        // Load this last so everything works.
        loadModule('building.js');

        // Load templates
        $.Lacuna.templates = {};
        loadTemplate('building');
    });
});

function loadModule(name) {
    // $.getScript() only accepts full URLS.
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    
    $.getScript(url + name).done(function() {
        debug_console('Correctly loaded ' + name + ' at ' + url + '.');
        animate();
        
    }).fail(function() {
        debug_console('Failed to load ' + name + ' at ' + url + '.');
    });
}

var loadedModules = 0;
function animate() {
    loadedModules++;
    var percent = Math.round((loadedModules / 8) * 100); // 8 being the number of modules/templates to load
    $("#loadingProgressBar .ui-progressbar-value").animate({
        width: percent + '%'
    }, 300, function() {
        $('#loadingProgressBarMessage').html(percent + '% - ' + makeRandomMessage()); // TODO: Make this look prettier!
        $('#loadingProgressBar').progressbar({value: percent}); // Register the percent change.
    });
}

function debug_console(message) {
    if (typeof($.Lacuna) === 'object') {
        $.Lacuna.debug(message);
    }
    else {
        console.log(message);
    }
}

function loadTemplate(name) {
    var url = 'templates/' + name + '.tmpl';
    $.get(url, function(data) {
        var tmpls = $(data).filter('script');

        animate();

        tmpls.each(function() {
            var textContent = $(this).html();
            textContent = textContent.replace('<![CDATA[','');
            textContent = textContent.replace(']]>','');
            $.Lacuna.templates[this.id] = _.template(textContent);          
        });
    });
}

var makeRandomMessage = function() {
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
    ],
    /*var*/    number;

    // Just keep generating the number until it's in range.
    do {
        number = Math.floor((Math.random() * 100) + 1);
    } while (number > messages.length);
    
    return messages[number] || 'finding the bugs'; // lol
}