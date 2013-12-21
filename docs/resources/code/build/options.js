{
    // Base directory for the application
    "base": null,

    // Base url for the application
    "baseUrl": "",

    // Arguments for application
    "args": {},

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
        "js":   "application.js",
        "css":  "application.css",
        "html": "index.html"
    },

    // Static files
    // Map of {"directory": "absolute/path"}
    "static": {},

    // Index html
    // if null : file is generated
    // if non null : file ocntent will be written
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

    // Arguments
    "args": {}
}