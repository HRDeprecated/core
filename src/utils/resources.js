define([
    "Underscore",
    "hr/configs",
    "hr/utils/logger",
    "hr/utils/cache",
    "hr/utils/requests",
    "hr/utils/urls",
    "hr/utils/deferred",
], function(_, configs, Logger, Cache, Requests, Urls, Deferred) {

    var logging = Logger.addNamespace("resources");
    var cache = Cache.namespace("resources");

    var Resources = {
        loaders: {},
        namespaces: {},

        /*
         *  Load a ressource
         */
        load: function(namespace, ressource, args, options) {
            var d = new Deferred();
            var namespace_configs = _.extend({}, Resources.namespaces[namespace] || {}, options || {});
            var loader = namespace_configs.loader || configs.resources.loader;
            
            if (Resources.loaders[loader] == null) {
                logging.error("Loader doesn't exists ", loader, "namespace=",namespace);
                d.reject();
                return d;
            }
            Resources.loaders[loader](ressource, d, args, namespace_configs);
            return d;
        },

        /*
         *  Add loader
         *  @name : loader name
         *  @loader : loader function
         */
        addLoader: function(name, loader) {
            Resources.loaders[name] = loader;
        },

        /*
         *  Add namespace
         *  @name : namespace name
         *  @config : namespace configuration
         */
        addNamespace: function(name, config) {
            config = config || {};
            config = _.defaults(config, {
                loader: configs.resources.loader
            });
            config = _.extend(config, {
                namespace: name
            });
            Resources.namespaces[name] = config;
        }
    };

    // Require loader
    Resources.addLoader("require", function(ressourcename, callback, args, config) {  
        _.defaults(config, {
            mode: "text",
            base: "",
            extension: ""
        });
        ressourcename = config.mode + "!" + Urls.join(config.base, ressourcename) + config.extension;
        
        logging.debug("Load using require ", ressourcename);
        try {
            var content = require(ressourcename);
            callback.resolve(content);
        } catch(err) {
            logging.error("Error loading using require : ", ressourcename, err.message);
            callback.reject(null);
        }
    });

    // HTTP loader
    Resources.addLoader("http", function(ressourcename, callback, args, config) {
        _.defaults(config, {
            base: "./",
            extension: ""
        });
        ressourceurl = Urls.static(config.base, ressourcename) + config.extension;
        
        // Check application cache
        var content = cache.get(ressourcename);
        if (content != null) { callback.resolve(content); return; }

        // Get ressource using requests
        logging.debug("Load ressource using http ", ressourcename);
        Requests.get(ressourceurl).then(function(content) {
            cache.set(ressourcename, content);
            callback.resolve(content);
        }, function() {
            logging.error("Error loading using http : ", ressourcename);
            callback.reject(null);
        });
    });

    return Resources;
});