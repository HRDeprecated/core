define([
    "hr/utils",
    "hr/configs",
    "hr/logger",
    "hr/storage"
], function(_, configs, Logger, Storage) {

    var logging = Logger.addNamespace("cache");
    var cache_methods = ["get", "set", "remove"];

    var Cache = {
        /*
         *  Initialize the cache : delete all the "old-version" values
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
         *  Transform a key in cache key
         *  @namespace : cat of the key
         *  @key : key of the data to cache
         */
        key: function(namespace, key) {
            key = JSON.stringify(key);
            return "cache_" + configs.revision + "_" + namespace + "_" + key;
        },

        /*
         *  Get a data from the cache
         *  @namespace : cat of the key
         *  @key : key of the data to get
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
         *  Delete a cache value
         *  @namespace : cat of the key
         *  @key : key of the data to get
         */
        remove: function(namespace, key) {
            var ckey = Cache.key(namespace, key);
            var ctime = (new Date()).getTime();
            Storage.remove(ckey);
        },

        /*
         *  Set a data in the cache
         *  @namespace : cat of the key
         *  @key : key of the data to set
         *  @value : value for the key
         *  @expiration : time before cache is invalid (in second)
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

        /*
         *  Clear the all cache
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

        /*
         *  Return a cache interface for a namespace
         *  @namespace : namespace for this interface
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