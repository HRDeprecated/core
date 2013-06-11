var yapp = require("../yapp");
var path = require("path");

yapp.Application({
    // Base directory
    "base": __dirname,

    // Base url for the application
    "baseUrl": "/yapp.js/",

    // Application name
    "name": "Yapp Documentation",

    // Mode debug
    "debug": true,

    // Main entry file
    "main": "application",

    // Build directory
    "build": path.resolve(__dirname, "build"),

    // Static files
    "static": {
        "templates": path.resolve(__dirname, "ressources", "templates"),
        "i18n": path.resolve(__dirname, "ressources", "i18n"),
        "images": path.resolve(__dirname, "ressources", "images"),
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
});