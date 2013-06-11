define([
    "Underscore",
    "yapp/configs",
    "yapp/utils/logger",
    "yapp/utils/cache",
    "yapp/utils/requests",
    "yapp/utils/urls",
    "yapp/utils/deferred",
], function(_, configs, Logger, Cache, Requests, Urls, Deferred) {

    var logging = Logger.addNamespace("ressources");
    var cache = Cache.namespace("ressources");

    var Ressources = {
        loaders: {},
        namespaces: {},

        /*
         *  Load a ressource
         */
        load: function(namespace, ressource) {
            var d = new Deferred();
            var namespace_configs = Ressources.namespaces[namespace] || {};
            var loader = namespace_configs.loader || configs.ressources.loader;
            
            if (Ressources.loaders[loader] == null) {
                logging.error("Loader doesn't exists ", loader, "namespace=",namespace);
                d.reject();
                return d;
            }
            Ressources.loaders[loader](ressource, d, namespace_configs);
            return d;
        },

        /*
         *  Add loader
         *  @name : loader name
         *  @loader : loader function
         */
        addLoader: function(name, loader) {
            Ressources.loaders[name] = loader;
        },

        /*
         *  Add namespace
         *  @name : namespace name
         *  @config : namespace configuration
         */
        addNamespace: function(name, config) {
            config = config || {};
            config = _.defaults(config, {
                loader: configs.ressources.loader
            });
            config = _.extend(config, {
                namespace: name
            });
            Ressources.namespaces[name] = config;
        }
    };

    // Require loader
    Ressources.addLoader("require", function(ressourcename, callback, config) {  
        _.defaults(config, {
            mode: "text",
            base: ""
        });
        ressourcename = config.mode+"!"+Urls.join(config.base, ressourcename);
        
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
    Ressources.addLoader("http", function(ressourcename, callback, config) {
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

    return Ressources;
});