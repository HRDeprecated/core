define([
    'q',
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
        },

        /*
         *  Add a method
         */
        addMethod: function(method, properties) {
            if (this.methods[method]) throw "Method already define for this backend: "+method;
            this.methods[method] = properties;
        },

        /*
         *  Add a cached method for offline use
         */
        addCachedMethod: function(method, sId) {
            sId = sId || method;
            sId = this.options.prefix+"."+sId;
            return this.addMethod(method, {
                fallback: function() {
                    return Storage.get(sId);
                },
                after: function(args, results) {
                    Storage.set(sId, results);
                }
            });
        },

        /*
         *  Execute a method
         */
        execute: function(method, args, options, previousMethod) {
            var that = this;
            if (!this.methods[method] && this.options.useDefaults) {
                previousMethod = method;
                method = "*";
            }

            if (!this.methods[method]) throw "Method not found: "+method;

            previousMethod = previousMethod || method;
            options = options || {};
            var methodHandler = null;

            // Is offline
            if (!Offline.isConnected()) {
                methodHandler = this.methods[method].fallback;
            }
            methodHandler = methodHandler || this.methods[method].execute;

            // If no handler, try default
            if (!methodHandler && this.methods["*"]) return this.execute("*", args, options, method);

            // No default
            if (!methodHandler) {
                return Q.reject(new Error("No handler found for this method in this backend"));
            }

            return Q(methodHandler(args, options, previousMethod)).then(function(results) {
                if (that.methods[previousMethod] && that.methods[previousMethod].after) {
                    that.methods[previousMethod].after(args, results, options, method)
                }
                return results;
            })
        }
    });

    return Backend;
});