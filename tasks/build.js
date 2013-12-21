var _ = require('underscore');
var Builder = require('../lib/builder').Builder;
var defaultConfig = require('../lib/defaults');

module.exports = function(grunt) {
    grunt.registerMultiTask('hr', 'Build an HappyRhino Application.', function() {
        var options = this.options({

        });

        var done = this.async();

        // Adapt config
        var config = _.defaults(this.data, defaultConfig);
        var builder = new Builder(config, grunt.log);
        builder.build().fin(done);
    });
};