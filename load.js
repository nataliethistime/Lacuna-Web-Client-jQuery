// TODO: loading screen!

// Create the URL for use within the client.
if (typeof(window.serverUrl) != 'undefined') {
    window.url = window.serverUrl;
}
else {
    window.url = window.location.protocol + '//' + window.server+ '.lacunaexpanse.com';
}

var dependencies = [
    'jquery',
    'lacuna',
    'game',
    'library',
    'mapPlanet',
    'login',
    'buildings/planetaryCommand',
    'building'
];

requirejs(dependencies, function($, Lacuna, Game) {

    // Now that everything is loaded, start the game! :D
    Game.start();
});