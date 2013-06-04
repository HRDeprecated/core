define([
    "jQuery",
    "Underscore",
    "yapp/configs",
    "yapp/core/class",
    "yapp/utils/logger",
], function($, _, configs, Class, Logger) {

    var logging = Logger.logging.addType("history");

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
                logging.warning("routing history already started");
                return false;
            }

            var self = this;
            var $window = $(window);
            var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);

            logging.log("start routing history mode=", configs.router.mode);

            if (configs.router.mode == "html5") {
                // Bind history changement
                $window.bind('popstate', _.bind(this._handleCurrentState, this));

                // Bind hash changement
                //$window.bind('hashchange', _.bind(this._handleCurrentState, this));

                // Bind links click
                $('body').on('click.link.history', 'a[href^="/"],a[href^="'+rootUrl+'"]', function (e) {
                    e.preventDefault();
                    var $a = $(e.currentTarget);
                    self.navigate($a.attr("href"), "get");
                });

                // Bind form submit
            }  else if (configs.router.mode == "hashs") {
                $window.bind('hashchange', _.bind(this._handleCurrentState, this));
            }
            

            this._handleCurrentState();
            this.started = true;

            return true;
        },

        /*
         *  Navigate
         */
        navigate: function(url, mode, data, options) {
            mode = mode || "get";
            data = data || {};

            var state = {
                mode: mode,
                data: data 
            };

            logging.log("navigate to ", url, state);
            window.history.pushState(state, url, url);
            this._handleState(url, state);
            return this;
        },

        /*
         *  Handle a state changement in history
         *  @url : url of the state
         *  @state : state object
         */
        _handleState: function(url, state) {
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
            logging.log("handle state ", url, state, matched);
            return this;
        },

        /*
         *  Handle current page state
         */
        _handleCurrentState: function() {
            var url = window.location.pathname;
            if (configs.router.mode == "hashs") url = window.location.hash.replace("#", "");

            var state = window.history.state || {
                mode: "get",
                data: {}
            };
            return this._handleState(url, state);
        },
    }));

    return History;
});