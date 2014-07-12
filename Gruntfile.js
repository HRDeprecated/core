var path = require("path");
var express = require("express");

module.exports = function (grunt) {
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json')
    });

    grunt.registerTask('buildapp', function(dir) {
        var done = this.async();

        grunt.log.writeln('processing ' + dir);

        grunt.util.spawn({
            grunt: true,
            args:[],
            opts: {
                cwd: dir
            }
        },

        function(err, result, code) {
            if (err == null) {
                grunt.log.writeln('processed ' + dir);
                done();
            }
            else {
                grunt.log.writeln('processing ' + dir + ' failed: ' + code);
                done(false);
            }
        })
    });

    grunt.registerTask('test', [
        'buildapp:test/'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);
};