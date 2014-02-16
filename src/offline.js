define([
    "hr/dom",
    "hr/logger",
    "hr/class"
], function($, Logger, Class) {
    var logging = Logger.addNamespace("offline");

    var OfflineManager = Class.extend({
        initialize: function() {
            var that = this;
            OfflineManager.__super__.initialize.apply(this, arguments);
            this.state = true;
            this.available = typeof window.applicationCache !== 'undefined';

            $(window).bind("online offline", function() {
                that.check();
            });
            
            if (this.available) {
                window.applicationCache.addEventListener('updateready', function() {
                    that.trigger("update");
                });
            }
        },

        // Check for cache update
        checkUpdate: function() {
            if (!this.available) return;

            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                this.trigger("update");
            }
            return window.applicationCache.status === window.applicationCache.UPDATEREADY;
        },

        // Set connexion status
        setState: function(state) {
            if (state == this.state) return;

            this.state = state;
            logging.log("state ", this.state);
            this.trigger("state", this.state);
        },

        // Check connexion status
        check: function() {
            var state = navigator.onLine;
            this.setState(state);
            return Q(state);
        },

        // Return true if connexion is on
        isConnected: function() {
            return this.state;
        }
    });


    return new OfflineManager();
});