// Requires
var _ = require('underscore');

var utils = require('./utils');

// Require subparts
var createLoader = require('./loader').createLoader;
var createRunner = require('./runner').createRunner;
var createBuilder = require('./builder').createBuilder;



function Application(appFolder, options) {
    // Application's folder
    // Default to current directory
    this.path = appFolder || process.cwd();

    // Get the app's config
    this.config = this.loadConfig();

    // Application options
    this.options = options || {};

    _.bindAll(this);
}

Application.prototype.loadConfig = function() {
    return createLoader(this.path).load();
};

Application.prototype.name = function() {
    return this.config.name;
};

//
// ACTIONS
//
Application.prototype.run = function() {
    return createRunner(this.config).run();
};

Application.prototype.build = function() {
    return createBuilder(this.config).build();
};

Application.prototype.all = function() {
    this.build();
    return this.run();
};

// Exports
exports.Application = Application;
exports.createApp = utils.classCreator(Application);