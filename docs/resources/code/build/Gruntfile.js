var path = require("path");

module.exports = function (grunt) {
    var docsPath = path.resolve(__dirname);

    grunt.initConfig({
        'hr': {
            build: {
                // Base directory for the application
                "base": __dirname,

                // Application name
                "name": "MyApplication",

                // Mode debug
                "debug": true,

                // Main entry point for application
                "main": "main",

                // Build output directory
                "build": path.resolve(__dirname, "build"),

                // Static files mappage
                "static": {
                    "templates": path.resolve(__dirname, "resources", "templates"),
                    "images": path.resolve(__dirname, "resources", "images")
                },

                // Stylesheet entry point
                "style": path.resolve(__dirname, "stylesheets/imports.less")
            }
        }
    });

    grunt.loadNPMTasks('hr.js');
    grunt.registerTask('default', [
        'hr'
    ]);
};