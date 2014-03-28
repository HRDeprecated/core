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
         * The head manager to maanage title, meta, links
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

        /* Base map of meta/link name -> value */
        metas: {},
        links: {},

        /* Router to use */
        Router: Router,

        /* Routes map of pattern -> method */
        routes: {},

        /*
         *  Initialize the application
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

        /*
         *  Run application
         */
        run: function() {
            logging.log("Run application", this.name);

            var hr = require("hr/hr");
            hr.Cache.init();
            hr.app = this;
            
            this.update();
            return this;
        },

        /*
         *  Set of get page title
         */
        title: function() {
            return this.head.title.apply(this.head, arguments);
        },

        /*
         *  Add routing
         *  @route : regex or route string
         *  @name : name of the method for the route callback
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