module.exports = {
    // Base directory for the application
    "base": null,

    // Base url for the application
    "baseUrl": "",

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
    "compilers": {
        "css": "lessc -x -O2 %s > %s",
        "js":   "r.js -o %s"
    },

    // Arguments for application
    "args": {}
};