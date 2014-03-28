define([
    "hr/dom",
    "hr/utils",
    "hr/view",
    "hr/head",
    "hr/router",
    "hr/logger"
], function($, _, View, Head, Router, Logger) {
    var logging = Logger.addNamespace("application");

    /**
     * Represent an entire application on the document DOM
     *
     * @class Application
     */
    var Application = View.extend({
        /**
         * The main element for this application.
         *
         * @property
         * @type {jQueryElement}
         * @default $("body")
         */
        el: $("body"),

        /**
         * The head manager to use
         *
         * @property
         * @type {Class}
         */
        Head: Head,

        /**
         * Name of the application
         *
         * @property
         * @type {string}
         */
        name: null,

        /**
         * Map of meta tags
         *
         * @property
         * @type {object<string>}
         */
        metas: {},

        /**
         * Map of link tags
         *
         * @property
         * @type {object<string>}
         */
        links: {},

        /**
         * The router manager to use
         *
         * @property
         * @type {Class}
         */
        Router: Router,

        /**
         * Map of routes
         *
         * @property
         * @type {object<string:string|function>}
         */
        routes: {},

        /**
         * @constructor
         */
        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            // Initialize head manager
            this.head = new this.Head({
                app: this
            });
            this.head.meta(this.metas);
            this.head.link(this.links);

            this.title("");

            this.route(_.result(this, "routes"));
            this.on("ready", _.once(function() {
                logging.log("Application is ready");
                if (this.router) this.router.start();
            }), this);

            return this;
        },

        /**
         * Start this application: prepare cache and render the application
         * 
         * @method run
         */
        run: function() {
            logging.log("Run application", this.name);

            var hr = require("hr/hr");
            hr.Cache.init();
            hr.app = this;
            
            this.update();
            return this;
        },

        /**
         * Set page title
         * 
         * @method title
         * @param {string} title - new page title
         * @return {string} - page title
         */
        title: function() {
            return this.head.title.apply(this.head, arguments);
        },

        /**
         * Add new route
         * 
         * @method route
         * @param {string} route - regex or route string
         * @param {string} name - method to use as a route callback
         * @return {string} - page title
         */
        route: function(route, name) {
            var handler;
            if (_.isObject(route) && !_.isRegExp(route)) {
                _.each(route, function(callback, route) {
                    this.route(route, callback);
                }, this);
                return this;
            }

            handler = this[name];
            if (handler == null) {
                handler = function() {
                    var args = _.values(arguments);
                    args.unshift('route:'+name);
                    this.trigger.apply(this, args);
                };
            }

            if (!this.router) this.router = new this.Router();
            this.router.route(route, name, _.bind(handler, this));
            return this;
        }
    });

    return Application;
});