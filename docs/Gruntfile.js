var path = require("path");

module.exports = function (grunt) {
    var docsPath = path.resolve(__dirname);

    grunt.initConfig({
        'hr': {
            build: {
                // Base directory
                "base": docsPath,

                // Base url for the application
                "baseUrl": "/hr.js/",

                // Application name
                "name": "HappyRhino Documentation",

                // Mode debug
                "debug": true,

                // Main entry file
                "main": "application",

                // Build directory
                "build": path.resolve(docsPath, "build"),

                // Static files
                "static": {
                    "templates": path.resolve(docsPath, "resources", "templates"),
                    "i18n": path.resolve(docsPath, "resources", "i18n"),
                    "images": path.resolve(docsPath, "resources", "images"),
                },

                // Stylesheets
                "style": path.resolve(docsPath, "resources/stylesheets/imports.less"),

                // Modules paths
                "paths": {
                    "highlight": "vendors/highlight"
                },
                "shim": {
                    "highlight": {
                        exports: "hljs"
                    }
                }
            }
        }
    });

    grunt.loadTasks('../tasks');
    grunt.registerTask('default', [
        'hr'
    ]);
};