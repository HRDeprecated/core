// Requires
var path = require('path');

var NODE_MODULES_BIN = path.resolve(__dirname, '../node_modules/.bin/');

// Use versioned compilers by default
var LESSC = "\""+path.join(NODE_MODULES_BIN, 'lessc')+"\"";
var RJS = "\""+path.join(NODE_MODULES_BIN, 'r.js')+"\"";

module.exports = {
    // Base directory for the application
    "base": null,

    // Base url for the application
    "baseUrl": "/",

    // Application name
    "name": "untitled",

    // Mode debug
    // if debug is false then files are compressed for optimization
    "debug": true,

    // Main entry file for application
    "main": null,

    // Build directory for output
    // directory is created if inexistant
    "build": null,

    // Output files
    "out": {
        "js":   "static/application.js",
        "css":  "static/application.css",
        "html": "index.html"
    },

    // bower dependencies
    "dependencies": {},

    // Static files
    // Map of {"directory": "absolute/path"}
    "static": {},

    // Static directory base
    "staticBase": "static",

    // Index html
    // if null : file is generated
    // if non null : file is copying
    "index": null,

    // Stylesheets entry file
    "style": null,

    // Modules paths and shim for require
    "paths": {},
    "shim": {},

    // Compilers
    // Most likely shouldn't be overridden
    "compilers": {
        "css": LESSC+" -x -O2 \"%s\" > \"%s\"",
        "js":   RJS+" -o \"%s\""
    },

    // Arguments for application
    "args": {},

    // R.js options
    "options": {}
};
