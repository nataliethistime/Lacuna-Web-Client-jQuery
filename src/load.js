// This snippet prevents the user from navigating to
// one of the tabs that was on the screen when they
// would've hit "F5" on their keyboard.
// When they do this, there's a lot of funk happening,
// so, I've found it's best to just remove the hash
// and load afresh.
if (window.location.hash !== '') {
    var newUrl = window.location.protocol +
        '//' + window.location.hostname + (window.location.pathname || '') + (window.location.search || '');
    window.location.href = newUrl; // Automatically refreshes.
    window.location.hash = ''; // Remove the hash to prevent infinite looping.
}

require.config({
    paths: {
        jquery          : 'js/jquery',
        jqueryUI        : 'js/jquery-ui-1.10.3.custom',
        zebra_cookie    : 'js/zebra_cookie',
        underscore      : 'js/underscore',
        templates       : '../templates'
    },
    shim: {
        jqueryUI: ['jquery'], // Attach jQueryUI to jQuery.
        underscore: {
            exports: '_'
        },
        zebra_cookie: ['jquery'], // Attach zebra_cookie to jQuery.

        // Bust caching of the JS files.
        urlArgs : 'bust=' + new Date().getTime()
    }
});

requirejs(['jquery', 'game'], function($, Game) {

    // Create the URL for use within the client.
    if (typeof(window.serverUrl) !== 'undefined') {
        window.url = window.serverUrl;
    }
    else {
        window.url = window.location.protocol + '//' + window.server + '.lacunaexpanse.com';
    }

    // Now that everything is loaded, start the game! :D
    Game.start();
});
