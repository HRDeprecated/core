define([
    "Underscore",
    "yapp/configs",
    "yapp/utils/logger",
    "yapp/utils/requests",
    "yapp/utils/urls",
    "yapp/utils/cache"
], function(_, configs, Logger, Requests, Urls, Cache) {
    /*
     *  This template loader load templates using http requests
     *  Store templates in application cache
     */

    var cache = Cache.namespace("templates");

    return function(tplname, callback) {
        var content = null;
        tplurl = Urls.static([
            configs.templates.loaders.http.prefix,
            tplname,
            configs.templates.loaders.http.extension].join(""));
        
        // Check application cache
        var content = cache.get(tplname);
        if (content != null) { callback(content); return; }

        // Get template using requests
        Logger.logging.debug("Load template using http ", tplname);
        Requests.get(tplurl, {}, function(content) {
            if (content == null) Logger.logging.error("Error loading template using http : ", tplname);
            cache.set(tplname, content);
            callback(content);
        });

    };
});