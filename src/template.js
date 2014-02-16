define([
    "hr/utils",
    "hr/promise",
    "hr/configs",
    "hr/class",
    "hr/logger",
    "hr/urls",
    "hr/resources",
    "hr/i18n",
    "hr/offline"
], function(_, Q, configs, Class, Logger, Urls, Resources, I18n, Offline) {
    var logging = Logger.addNamespace("templates");

    var Template = Class.extend({
        defaults: {
            /* Template id */
            template: null,

            /* Loader for the template */
            loader: "templates",

            /* Context givent to template generation */
            args: {}
        },


        /*
         *  Initialize the template
         */
        initialize: function() {
            var self = this;

            this.template = this.options.template;
            this.args = this.options.args || {};

            // Related view
            this.view = this.options.view || null;

            // Init template context
            _.extend(this.args, {
                "_": _,
                "hr": {
                    "configs": configs,
                    "urls": Urls,
                    "i18n": I18n,
                    "offline": Offline
                },
                "view": {
                    "component": function(cid, args, name, subid) {
                        name = name || cid;

                        if (!self.view) {
                            throw new Error("Error in template " + self.template + " : try to import component in a non view-related template ");
                        }

                        if (Template.components[cid] == null) {
                            throw new Error("Error in template " + self.template + " : try to import component "+cid);
                        }

                        var view = new Template.components[cid].Class(args || {}, self.view);
                        
                        self.view.addComponent(name, view);

                        var component = $("<component/>", {
                            "data-component": view.cid
                        });

                        return component[0].outerHTML;
                    }
                },
                "template": {
                    "args": this.args,
                    "name": this.template,
                    "import": function(name, args, cname) {
                        cname = cname || name;
                        return this.args.view.component("template", {template: name, args: args}, cname);
                    },
                    "htmlid": function(h) {
                        return _.escape(h);
                    }
                }
            }, Template.options);

            return this;
        },

        /*
         *  Definie template content
         */
        setContent: function(content) {
            this.content = content;
            if (this.content != null) this.generate = Q.fbind(_.template(this.content));
            return this;
        },

        /*
         *  Load template content
         */
        load: function(template) {
            var self = this;
            this.template = template || this.template;
            Resources.load(this.options.loader, this.template).then(function(content) {
                self.setContent(content);
                self.trigger("loaded");
            }, function() {
                self.setContent(null);
                self.trigger("error");
            });
            return this;
        },

        /*
         * Render template
         */
        render: function(el) {
            var that = this;
            var d = Q.defer();

            if (this.view != null) el = el || this.view.$el;
            this.on("loaded", function() {
                if (this.content == null) return;
                if (this.view != null) this.view.clearComponents();
                this.generate(this.args).then(function(content) {
                    el.html(content);
                    if (that.view != null) that.view.renderComponents();
                    that.trigger("updated");
                    d.resolve(el);
                }, function(err) {
                    logging.exception(err, "Error with template:");
                    d.reject(err);
                });
                
            }, this);
            this.load();

            return d.promise;
        },
    }, {
        /* Defaults options for template */
        options: {},

        /* Map of components constructor */
        components: {},

        /*
         *  Register a component
         *  @cid : component id (ex: "ui.header")
         */
        registerComponent: function(cid, ViewClass) {
            Template.components[cid] = {
                "id": cid,
                "Class": ViewClass
            };
        },

        /*
         *  Add contexts to all templates
         *  @options : options for templates to add
         */
        extendContext: function(options) {
            Template.options = _.extend(Template.options || {}, options);
        }
    });

    return Template;
});