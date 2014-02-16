define(["hr/utils"], function(_) {
    var Config = {
        // Revision
        "revision": 0,

        // Arguments
        "args": {},

        // Hr version
        "version": "0.5.3",

        // Log level
        // "log", "debug", "warn", "error", "none"
        "logLevel": "log",
        "logLevels": {},

        // Base url
        "baseUrl": "/",

        // Static files directory (relative to baseUrl)
        "staticDirectory": "static",

        // Configurations for resources loading
        "resources": {
            /* Default loader */
            "loader": "http"
        },

        // i18n
        "defaultLocale": "en",

        extend: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0,0, Config);
            _.deepExtend.apply(_, args);
        }
    };

    return Config;
});