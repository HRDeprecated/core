define([
    "Underscore",
    "yapp/configs",
    "yapp/utils/logger"
], function(_, configs, Logger) {
    /*
     *  This template loader load templates from the application source code using require.js
     *  you need to include your template to your application source code.
     */
    return function(tplname, callback) {
        var content = null;
        tplname = [
            configs.templates.loaders.require.mode,
            configs.templates.loaders.require.prefix,
            tplname,
            configs.templates.loaders.require.extension].join("");
        
        Logger.logging.debug("Load template using require ", tplname);
        try {
            content = require(tplname);
        } catch(err) {
            Logger.logging.error("Error loading template using require : ", tplname, err.message);
        }
        callback(content);
    };
});