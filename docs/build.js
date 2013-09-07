var path = require("path");

exports.config = {
    // Base directory
    "base": __dirname,

    // Base url for the application
    "baseUrl": "/hr.js/",

    // Application name
    "name": "HappyRhino Documentation",

    // Mode debug
    "debug": true,

    // Main entry file
    "main": "application",

    // Build directory
    "build": path.resolve(__dirname, "build"),

    // Static files
    "static": {
        "templates": path.resolve(__dirname, "resources", "templates"),
        "i18n": path.resolve(__dirname, "resources", "i18n"),
        "images": path.resolve(__dirname, "resources", "images"),
    },

    // Stylesheets
    "style": path.resolve(__dirname, "stylesheets/imports.less"),

    // Modules paths
    "paths": {
        "highlight": "vendors/highlight"
    },
    "shim": {
        "highlight": {
            exports: "hljs"
        }
    }
};