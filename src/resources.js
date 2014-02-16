define([
    "hr/utils",
    "hr/promise",
    "hr/configs",
    "hr/logger",
    "hr/cache",
    "hr/requests",
    "hr/urls"
], function(_, q, configs, Logger, Cache, Requests, Urls) {

    var logging = Logger.addNamespace("resources");
    var cache = Cache.namespace("resources");

    var Resources = {
        loaders: {},
        namespaces: {},

        /*
         *  Load a ressource
         */
        load: function(namespace, ressource, args, options) {
            var d = Q.defer();
            var namespace_configs = _.extend({}, Resources.namespaces[namespace] || {}, options || {});
            var loader = namespace_configs.loader || namespace;
            
            if (Resources.loaders[loader] == null) {
                logging.error("Loader doesn't exists ", loader, "namespace=",namespace);
                d.reject();
                return d.promise;
            }
            Resources.loaders[loader](ressource, d, args, namespace_configs);
            return d.promise;
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

    // Text loader
    Resources.addLoader("text", function(ressourcename, callback, args, config) {  
        callback.resolve(ressourcename);
    });

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
            logging.exception(err, "Error loading using require:");
            callback.reject(null);
        }
    });

    // HTTP loader
    Resources.addLoader("http", function(ressourcename, callback, args, config) {
        _.defaults(config, {
            base: "./",
            extension: ""
        });
        var ressourceurl = Urls.static(config.base, ressourcename) + config.extension;
        
        // Check application cache
        var content = cache.get(ressourceurl);
        if (content != null) { callback.resolve(content); return; }

        // Get ressource using requests
        logging.debug("Load ressource using http ", ressourcename);
        Requests.get(ressourceurl).then(function(content) {
            cache.set(ressourceurl, content);
            callback.resolve(content);
        }, function() {
            logging.error("Error loading using http : ", ressourcename);
            callback.reject(null);
        });
    });

    return Resources;
});