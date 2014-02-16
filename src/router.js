define([
    "hr/dom",
    "hr/utils",
    "hr/class",
    "hr/history",
    "hr/logger",
], function($, _, Class, History, Logger) {

    // Add specifif logs handler
    var logging = Logger.addNamespace("routing");

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var namedParam    = /:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;


    var Router = Class.extend({
        /* Routes map of pattern -> method */
        routes: {},

        /*
         *  Initialize the router
         */
        initialize: function() {
            this.route(_.result(this, 'routes'));
            return this;
        },

        /*
         *  Add a route
         *  @route : regex ou route string
         *  @name : name for the route
         *  @callback : callback when routing
         */
        route: function(route, name, callback) {
            if (_.isObject(route) && _.isRegExp(route) == false) {
                _.each(route, function(callback, route) {
                    this.route(route, callback, callback);
                }, this);
                return this;
            }

            if (!_.isRegExp(route)) route = Router.routeToRegExp(route);
            logging.log("add route ", name, route);

            History.route(route, _.bind(function(url) {
                var args = Router.extractParameters(route, url);
                logging.log("route callback ", url, name, args);
                callback && callback.apply(this, args);
                this.trigger.apply(this, ['route:' + name].concat(args));
            }, this));

            return this;
        },

        /*
         *  Start the router
         */
        start: function() {
            logging.log("start routing");
            History.start();
            return this;
        },

        /*
         *  Navigate
         */
        navigate: function() {
            History.navigate.apply(History, arguments);
            return this;
        },
    }, {
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

    return Router;
});