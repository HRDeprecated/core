var path = require("path");

module.exports = function (grunt) {
    var testPath = path.resolve(__dirname);

    grunt.initConfig({
        'hr': {
            build: {
                // Base directory
                "base": testPath,

                // Application name
                "name": "Hr.js tests",

                // Mode debug
                "debug": true,

                // Main entry file
                "main": "application",

                // Build directory
                "build": path.resolve(testPath, "build")
            }
        }
    });

    grunt.loadTasks('../tasks');
    grunt.registerTask('default', [
        'hr'
    ]);
};