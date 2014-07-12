var path = require("path");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-hr-builder');

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'shell': {
            tests: {
                command: "./node_modules/.bin/phantomjs ./test/run.js"
            },
            benchmarks: {
                command: "./node_modules/.bin/phantomjs ./test/run.js --benchmarks"
            }
        },
        'hr': {
            tests: {
                "source": __dirname,
                "base": path.resolve(__dirname, "./test"),
                "name": "HappyRhino Tests",
                "debug": true,
                "main": "application"
            }
        }
    });

    grunt.registerTask('tests', [
        'hr:tests',
        'shell:tests'
    ]);

    grunt.registerTask('benchmarks', [
        'shell:benchmarks'
    ]);

    grunt.registerTask('default', [
        'tests',
        'benchmarks'
    ]);
};