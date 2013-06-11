// Requires
var _ = require('underscore');

var fs = require('fs');
var path = require('path');

var express = require('express');

var utils = require('./utils');

// Default config
var defaultConfig = require('./defaults/config');

// create logger
var log = utils.logAs("load");


// Constants
var REQUIRED_ATTRIBUTES = [
    'base',
    'main',
    'build'
];


function Loader(path) {
    this.path = path;
}

Loader.prototype.load = function() {
    // Different supported loaders
    // path -> loader function

    var loaders = [
        [this._nodeConfigPath(), this._loadNodeConfig],
        [this._jsonConfigPath(), this._loadJSONConfig]
    ];

    var supportedLoaders = loaders.filter(function(vals) {
        // Check if path exists
        return fs.existsSync(vals[0]);
    });

    // Neither files were found ...
    if(_.isEmpty(supportedLoaders)) {
        log("No build.js/build.json file in "+this.path, "error")
        throw new Error("Could not find any build.js or build.json.");
    }

    // Pick first supported loader
    var choosenLoader = supportedLoaders[0];

    var configFile = choosenLoader[0];
    var loaderFunc = choosenLoader[1];

    // Log
    log("Loading "+configFile+" ...");

    var config = loaderFunc(configFile);

    if(!this.validateConfig(config)) {
        throw new Error("Configuration is invalid");
    }

    // Mixin defaults
    return _.defaults(
        config,

        // General defaults
        defaultConfig,

        // Default base directory for app
        {
            base: this.path
        }
    );
};

Loader.prototype.validateConfig = function(config) {
    // Check for emptiness
    if(_.isEmpty(config)) {
        log("Configuration must not be empty", "error");
        return false;
    }

    // Check for main keys
    var configHas = _.partial(
        _.has,
        config
    );

    var hasAttributes = _.all(_.map(
        REQUIRED_ATTRIBUTES,
        configHas
    ));

    if(!hasAttributes) {
        var keys = REQUIRED_ATTRIBUTES.join(', ');
        log("Configuration is missing values for: "+keys, "error");
        return false;
    }

    return true;
};

Loader.prototype._nodeConfigPath = function() {
    return path.resolve(this.path, 'build.js');
};

Loader.prototype._jsonConfigPath = function() {
    return path.resolve(this.path, 'build.json');
};

Loader.prototype._loadNodeConfig = function(path) {
    var configModule = require(path);
    return configModule.config || configModule;
};

Loader.prototype._loadJSONConfig = function(path) {
    return require(path);
};


// Exports
exports.Loader = Loader;
exports.createLoader = utils.classCreator(Loader);
