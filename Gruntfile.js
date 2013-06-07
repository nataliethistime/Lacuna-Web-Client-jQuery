module.exports = function(grunt) {

    grunt.initConfig({
        // Load the package.json file.
        pkg: grunt.file.readJSON('package.json'),
        
        // Config options for jshint.
        jshint: {
            files: ['*.js', 'src/*.js', 'src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        }
    });

    // Load all the plugins.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Specify what tasks can be run.
    grunt.registerTask('test', ['jshint'/* In here will be Qunit */]);
};
