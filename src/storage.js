define([
    "hr/utils",
    "hr/class",
    "hr/configs",
    "hr/logger"
], function(_, Class, configs, Logger) {
    var logging = Logger.addNamespace("storage");

    var Storage = Class.extend({
        defaults: {
            key: ""
        },

        /*
         *  Initialize a storage instance
         */
        initialize: function() {},

        /*
         *  Return a key
         */
        key: function(key) {
            return [this.options.key, key].join(":");
        },

        set: function(key, value) {
            return Storage.set(this.key(key), value);
        },
        get: function(key) {
            return Storage.get(this.key(key));
        },
        has: function(key) {
            return Storage.has(this.key(key));
        },
        remove: function(key) {
            return Storage.remove(this.key(key));
        }
    }, {
        /*
         *  Return storage context
         */
        storage: function() {
            try {
                return (typeof window.localStorage === 'undefined')? null : window.localStorage;
            } catch (e) {
                logging.error("Error accessing localStorage: ", e);
                return null;
            }
        },

        /*
         *  Return used space
         */
        usedSpace: function() {
            var ret = 100;
            var space = Storage.storage();
            return space.length;
        },

        /*
         *  Check that a key exists
         */
        has: function(key) {
            var s = Storage.storage();
            if (s == null) {
                return false;
            }
            return _.isUndefined(s[key]) == false;
        },

        /*
         *  Get a data from the storage
         *  @key : key of the data to get
         */
        get: function(key) {
            var s = Storage.storage();
            if (s == null) {
                return null;
            }
            if (_.isUndefined(s[key]) == false) {
                try {
                    return JSON.parse(s[key]);
                } catch(err) {
                    logging.error("Error parsing ", s[key], err);
                    return s[key];
                }

            } else {
                return null;
            }
        },

        /*
         *  Set a data in the storage
         *  @key : key of the data to set
         *  @value : value for the key
         */
        set: function(key, value) {
            var s = Storage.storage();
            if (s == null) {
                return null;
            }
            s[key] = JSON.stringify(value);
            return Storage.get(key);
        },

        /*
         *  Remove a data from the storage
         *  @key : key of the data to remove
         */
        remove: function(key) {
            var s = Storage.storage();
            if (s == null) {
                return false;
            }
            s.removeItem(key);
            return true;
        },

        /*
         *  Clear the all storage
         */
        clear: function() {
            var s = Storage.storage();
            if (s == null) {
                return false;
            }
            s.clear();
            return true;
        }
    });

    return Storage;
});