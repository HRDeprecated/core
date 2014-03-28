/**
 * @module hr/cache
 */
define([
    "hr/utils",
    "hr/configs",
    "hr/logger",
    "hr/storage"
], function(_, configs, Logger, Storage) {

    var logging = Logger.addNamespace("cache");
    var cache_methods = ["get", "set", "remove"];

    /**
     * @class Cache
     */
    var Cache = {
        /**
         * Initialize the cache : delete all the "old-version" values
         *
         * @method init
         */
        init: function() {
            var s = Storage.storage();
            if (s == null) {
                return false;
            }
            Object.keys(s).forEach(function(key){
                if (key.indexOf("cache_") == 0 && key.indexOf("cache_"+configs.revision) ) {
                    s.removeItem(key);
                }
            });
        },

        /*
         * Transform a key in cache key
         *
         * @method key 
         * @param {string} namespace namespace for this key
         * @param {string} key key of the data to cache
         * @return {string} complete key for the cache
         */
        key: function(namespace, key) {
            key = JSON.stringify(key);
            return "cache_" + configs.revision + "_" + namespace + "_" + key;
        },

        /*
         * Get data from the cache
         *
         * @method get
         * @param {string} namespace namespace for this key
         * @param {string} key key of the data to cache
         * @return {object} value from the cache
         */
        get: function(namespace, key) {
            var ckey = Cache.key(namespace, key);
            var ctime = (new Date()).getTime();

            var v = Storage.get(ckey);
            if (v == null) {
                return null;
            } else {
                if (v.expiration == -1 || v.expiration > ctime) {
                    return v.value;
                } else {
                    Storage.remove(ckey);
                    return null;
                }
            }
        },

        /*
         * Delete a cache value
         *
         * @method remove
         * @param {string} namespace namespace for this key
         * @param {string} key key of the data to cache
         */
        remove: function(namespace, key) {
            var ckey = Cache.key(namespace, key);
            var ctime = (new Date()).getTime();
            Storage.remove(ckey);
        },

        /*
         * Set a data in the cache
         *
         * @method get
         * @param {string} namespace namespace for this key
         * @param {string} key key of the data to cache
         * @param {object} value value to store in teh cache associated to this key
         * @param {number} [expiration] seconds before epiration of this value in the cache
         */
        set: function(namespace, key, value, expiration) {
            var ckey = Cache.key(namespace, key);
            var ctime = (new Date()).getTime();

            if (expiration > 0) {
                expiration = ctime + expiration * 1000;
            } else {
                expiration = -1;
            }

            Storage.set(ckey, {
                "expiration": expiration,
                "value": value
            });
            return Cache.get(key);
        },

        /**
         * Clear the entire cache
         *
         * @method clear
         */
        clear: function() {
            var s = Storage.storage();
            if (s == null) {
                return false;
            }
            Object.keys(s).forEach(function(key){
                   if (/^(cache_)/.test(key)) {
                       s.removeItem(key);
                   }
            });
        },

        /**
         * Return a cahce interface for a specific namespace
         *
         * @method namespace
         * @param {string} namespace name of the namespace
         */
        namespace: function(namespace) {
            var ncache = {};
            _.each(cache_methods, function(method) {
                ncache[method] = _.partial(Cache[method], namespace);
            })
            return ncache;
        }
    };

    return Cache;
});