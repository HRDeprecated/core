define([
    'hr/promise',
    'hr/class',
    'hr/offline',
    'hr/storage'
], function(Q, Class, Offline, Storage) {
    /*
     *  A backend define the way the application will manage:
     *      - access to a resources
     *      - caching of results
     *      - fallback when offline
     *      - resync when online
     */

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var namedParam    = /:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

    var Backend = Class.extend({
        defaults: {
            // use defaults '*' when method not found
            useDefaults: true,

            // prefix to use (for cache)
            prefix: "backend",
        },

        initialize: function() {
            Backend.__super__.initialize.apply(this, arguments);

            // Map of the methods
            this.methods = {};

            // Default method
            this.defaultHandler = null;
        },

        /*
         *  Add a method
         */
        addMethod: function(method, properties) {
            if (this.methods[method]) throw "Method already define for this backend: "+method;

            properties.id = method;
            properties.regexp = this.routeToRegExp(method);
            this.methods[method] = properties;

            return this;
        },

        /*
         *  Add a cached method for offline use
         */
        addCachedMethod: function(method, sId) {
            sId = sId || method;
            sId = this.options.prefix+"."+sId;
            return this.addMethod(method, {
                fallback: function(args, options, method) {
                    return Storage.get(sId+"."+method);
                },
                after: function(args, results, options, method) {
                    Storage.set(sId+"."+method, results);
                }
            });
        },

        /*
         *  Get the method handler to use
         */
        getHandler: function(method) {
            return _.find(this.methods, function(handler) {
                return handler.regexp.test(method);
            }) || this.defaultHandler;
        },

        /*
         *  Get default handler
         */
        defaultMethod: function(handler) {
            this.defaultHandler = handler;
            return this;
        },

        /*
         *  Execute a method
         */
        execute: function(method, args, options) {
            var that = this, methodHandler;

            options = options || {};

            var handler = this.getHandler(method);
            if (!handler) return Q.reject(new Error("No handler found for method: "+method));

            // Is offline
            if (!Offline.isConnected()) {
                methodHandler = handler.fallback;
            }
            methodHandler = methodHandler || handler.execute || this.defaultHandler.execute;

            // No default
            if (!methodHandler) {
                return Q.reject(new Error("No handler found for this method in this backend"));
            }

            return Q(methodHandler(args, options, method)).then(function(results) {
                if (handler.after) {
                    return Q.all([
                        Q(handler.after(args, results, options, method)),
                        Q((that.defaultHandler.after || function() {})(args, results, options, method))
                    ]).then(function() {
                        return Q(results);
                    }, function() {
                        return Q(results);
                    });
                }
                return results;
            });
        },

        /*
         *  Convert a route string into a regular expression, suitable for matching
         *  against the current location hash.
         */
        routeToRegExp: function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                            .replace(namedParam, '([^\/]+)')
                            .replace(splatParam, '(.*?)');
            return new RegExp('^' + route + '$');
        },

        /*
         *  Given a route, and a URL fragment that it matches, return the array of
         *  extracted parameters.
         */
        extractParameters: function(route, fragment) {
            return route.exec(fragment).slice(1);
        }
    });

    return Backend;
});