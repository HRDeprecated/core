var path = require("path");
var express = require("express");

module.exports = function (grunt) {
    var docsPath = path.resolve(__dirname, 'docs');

    grunt.initConfig({
        'http-server': {
            'docs': {
                root: path.resolve(__dirname, "docs/build"),
                port: 5000,
                host: "localhost"
            }
        },
        'gh-pages': {
            options: {
                base: 'docs/build'
            },
            src: ['**']
        }
    });
    grunt.loadNpmTasks('grunt-gh-pages');


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

    grunt.registerTask('run', function(dir) {
        var done = this.async();
 
        var app = express();
        app.use("/hr.js/",  express.static("./docs/build/"));
        var server = app.listen(5000, "localhost", function() {
            grunt.log.writeln("Server running on localhost:5000");
            grunt.log.writeln('Hit CTRL-C to stop the server');
        });

        process.on('SIGINT', function () {
            server.close();
            done();
            process.exit();
        });
    });

    grunt.registerTask('docs', [
        'buildapp:docs/'
    ]);

    grunt.registerTask('test', [
        'buildapp:test/'
    ]);

    grunt.registerTask('publish', [
        'docs',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'docs',
        'test'
    ]);
};