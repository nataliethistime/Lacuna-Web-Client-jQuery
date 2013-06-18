({
    baseUrl: 'src',
    out: 'Lacuna-Web-Client-jQuery-Build.js',
    name: 'load',

    keepBuildDir: true,

    shim: {
        jqueryUI: ['jquery'], // Attach jQueryUI to jQuery.
        underscore: {
            exports: '_'
        },
        zebra_cookie: ['jquery'] // Attach zebra_cookie to jQuery.
    },

    paths: {
        jquery: 'js/jquery',
        jqueryUI: 'js/jqueryUI',
        zebra_cookie: 'js/zebra_cookie',
        underscore: 'js/underscore'
    },

    modules: [
        { name: "buildingType/planetaryCommand" },
        { name: "buildingType/shipyard" },
        { name: "buildingType/spaceport" }
    ]
})
