var path = require("path");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-shell');

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'shell': {
            tests: {
                command: "./node_modules/.bin/phantomjs ./test/run.js"
            },
            benchmarks: {
                command: "./node_modules/.bin/phantomjs ./test/run.js --benchmarks"
            }
        }
    });

    grunt.registerTask('tests', [
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