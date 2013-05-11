// TODO: loading screen!

// This snippet prevents the user from navigating to
// one of the tabs that was on the screen when they
// would've hit "F5" on their keyboard.
// When they do this, there's a lot of funk happening,
// so, I've found it's best to just remove the hash
// and load afresh.
if (window.location.hash != '') {
    var newUrl = window.location.protocol +
                 '//' +
                 window.location.hostname +
                 (window.location.pathname || '') +
                 (window.location.search || '');
    window.location.href = newUrl; // Automatically refreshes.
    window.location.hash = ''; // Remove the hash to prevent infate looping.
}

require.config({
    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        jqueryUI: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min',
        zebra_cookie: 'js/zebra_cookie',
        underscore: 'js/underscore'
    },
    shim: {
        jqueryUI: ['jquery'], // Attach jQueryUI to jQuery.
        underscore: {
            exports: '_'
        },
        zebra_cookie: ['jquery'] // Attach zebra_cookie to jQuery.
    }
});

var javascriptFiles = [
    'jquery',
    'underscore',
    'lacuna',
    'game',
    'library',
    'mapPlanet',
    'login',
    'buildings/planetaryCommand',
    'building'
];
var templateFiles = [
    'building',
    'game',
    'login',
    'mapPlanet'
];

requirejs(javascriptFiles, function($, _, Lacuna, Game) {

    // NOTE: this method affects **ALL** Ajax calls!
    // We *must* make all AJAX calls asyncronous otherwise it will affect the user experience.
    $.ajaxSetup({
        async: false, // Need to do this or loading gets messed up sometimes.
    });
    $.support.cors = true; // For the template loading.

    // Create the URL for use within the client.
    if (typeof(window.serverUrl) != 'undefined') {
        window.url = window.serverUrl;
    }
    else {
        window.url = window.location.protocol + '//' + window.server+ '.lacunaexpanse.com';
    }

    // Now load the HTML templates.
    _.each(templateFiles, function(file) {
        var url = 'templates/' + file + '.tmpl';
    
        $.get(url, function(data) {
            var templates = $(data).filter('script');

            templates.each(function() {
                var textContent = $(this).html();
            
                textContent = textContent.replace('<![CDATA[','');
                textContent = textContent.replace(']]>','');
            
                Lacuna.Templates[this.id] = _.template(textContent);
            });
        });
    });

    // Now that everything is loaded, start the game! :D
    Game.start();
});

function loadTemplate(file) {
    
}