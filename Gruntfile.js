module.exports = function(grunt) {

    grunt.initConfig({
        // Load the package.json file.
        pkg: grunt.file.readJSON('package.json'),
        
        // Config options for jshint.
        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'src/!(js)**/*.js'],
            options: {
                jshintrc: '.jshintrc',
            }
        }
    });

    // Load all the plugins.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Specify what tasks can be run.
    grunt.registerTask('development', ['jshint'/* In here _will_ be Qunit tests */]);
};
