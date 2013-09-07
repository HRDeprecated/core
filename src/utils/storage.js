define([
    "Underscore",
    "hr/configs",
    "hr/utils/logger"
], function(_, configs, Logger) {

    var logging = Logger.addNamespace("storage");

    var Storage = {
        /*
         *  Return storage context
         */
        storage: function() {
            if (_.isUndefined(localStorage)) {
                return null;
            } else {
                return localStorage;
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
        },
    };

    return Storage;
});