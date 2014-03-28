/**
 * @module hr/configs
 */
define(["hr/utils"], function(_) {
    /**
     * @class Config
     */
    var Config = {
        // Revision
        "revision": 0,

        // Arguments
        "args": {},

        // Hr version
        "version": "0.6.4",

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

        /**
         * Extend the global configuration.
         * 
         * @method extend
         */
        extend: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0,0, Config);
            _.deepExtend.apply(_, args);
        }
    };

    return Config;
});