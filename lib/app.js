// Requires
var Q = require('q');
var _ = require('underscore');

var path = require('path');

var watchr = require('watchr');

var utils = require('./utils');

// Require subparts
var createLoader = require('./loader').createLoader;
var createRunner = require('./runner').createRunner;
var createBuilder = require('./builder').createBuilder;



function Application(appFolder, options) {
    // Application's folder
    // Default to current directory
    this.path = path.resolve(appFolder || process.cwd());

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
    return [
        this.build,
        this.run
    ].reduce(Q.when, Q());
};

// Paths to watch
Application.prototype.watchPaths = function() {
    var resolver = _.partial(path.resolve, this.path);
    var subpaths = [
        //
        // Folders
        //
        'views',
        'models',
        'vendors',
        'ressources',
        'stylesheets',

        //
        // Files
        //

        // Js entry point
        this.config.main + '.js',
        this.config.buildFile
    ];

    // Make them absolute
    var paths = _.map(subpaths, resolver);
    return paths;
};

Application.prototype.handleChange = function(changeType, filePath, fileCurrentStat, filePreviousStat) {
    if(filePath == this.config.buildFile) {
        this.config = this.loadConfig();
    }
    // TODO: Rerun server
    this.build();
    utils.log("dev", "Rebuilt client");
};

Application.prototype.dev = function() {
    // Build run
    this.all();

    // Then watch
    watchr.watch({
        paths: this.watchPaths(),

        listeners: {
            change: this.handleChange
        }
    });
    utils.log("dev", "Ready");
    utils.log("dev", "Watching for changes ...");
};

// Exports
exports.Application = Application;
exports.createApp = utils.classCreator(Application);