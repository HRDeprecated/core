define([
    "hr/dom",
    "hr/utils",
    "hr/configs",
    "hr/class",
    "hr/logger",
    "hr/urls",
], function($, _, configs, Class, Logger, urls) {

    var logging = Logger.addNamespace("history");

    var History = new (Class.extend({   
        /*
         *  Initialize the router
         */
        initialize: function() {
            this.handlers = [];
            this.started = false;
            return this;
        },

        /*
         *  Add a route
         *  @route : regex ou route string
         *  @name : name for the route
         *  @callback : callback when routing
         */
        route: function(route, callback) {
            this.handlers.unshift({
                route: route,
                callback: callback
            });

            return this;
        },

        /*
         *  Start the routers system
         */
        start: function() {
            if (this.started) {
                logging.warn("routing history already started");
                return false;
            }

            var self = this;
            var $window = $(window);
            var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);

            logging.log("start routing history");
            $window.bind('hashchange', _.bind(this._handleCurrentState, this));

            this._handleCurrentState();
            this.started = true;

            return true;
        },

        /*
         *  Navigate
         */
        navigate: function(route, args) {
            url = urls.route(route, args);
            logging.log("navigate to ", url);
            window.location.hash = url;
        },

        /*
         *  Handle a state changement in history
         *  @url : url of the state
         *  @state : state object
         */
        _handleState: function(url) {
            if (url == null) return this;
            if (url.length > 0 && url[0] == "/") {
                url = url.replace("/", "");
            }
            var matched = _.any(this.handlers, function(handler) {
                if (handler.route.test(url)) {
                    handler.callback(url);
                    return true;
                }
            });
            logging.log("handle state ", url, matched != null);
            return this;
        },

        /*
         *  Handle current page state
         */
        _handleCurrentState: function() {
            var url = window.location.hash.replace("#", "");
            return this._handleState(url);
        },
    }));

    return History;
});