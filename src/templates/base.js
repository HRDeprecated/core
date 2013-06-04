define([
    "Underscore",
    "yapp/configs",
    "yapp/core/class",
    "yapp/utils/logger",
    "yapp/utils/urls",

    "yapp/templates/loaders/require",
    "yapp/templates/loaders/http"
], function(_, configs, Class, Logger, Urls) {
    var Template = Class.extend({
        defaults: {
            /* Template id */
            template: null,

            /* Context givent to template generation */
            args: {},

            /* Loader for the template */
            loader: configs.templates.loader
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

            // Create loader method
            this.loader = this.options.loader || function(tpl, callback) { callback(null); };
            if (!_.isFunction(this.loader)) {
                this.loader = require(this.loader);
            }

            // Init template context
            _.extend(this.args, {
                "_": _,
                "yapp": {
                    "configs": configs,
                    "urls": Urls
                },
                "view": {
                    "component": function(cid, args, name, subid) {
                        name = name || cid;

                        if (!self.view) {
                            Logger.logging.error("Error in template " + self.template + " : try to import component in a non view-related template ");
                            return "";
                        }

                        if (Template.components[cid] == null) {
                            Logger.logging.error("Error in template " + self.template + " : try to import component "+cid);
                            return "";
                        }

                        var view = new Template.components[cid].Class(args || {});
                        
                        self.view.addComponent(name, view);

                        var component = $("<component/>", {
                            "data-component": view.cid
                        });

                        return component[0].outerHTML;
                    }
                }
            });

            return this;
        },

        /*
         *  Definie template content
         */
        setContent: function(content) {
            this.content = content;
            if (this.content != null) this.generate = _.template(this.content);
            return this;
        },

        /*
         *  Load template content
         */
        load: function(template) {
            var self = this;
            this.template = template || this.template;

            var callback = function(content) {
                self.setContent(content);
                self.trigger("loaded");
            };

            this.loader(this.template, callback);
            return this;
        },

        /*
         * Render template
         */
        render: function(el) {
            if (this.view != null) el = el || this.view.$el;
            this.on("loaded", function() {
                if (this.content == null) return;
                el.html(this.generate(this.args));
                if (this.view != null) this.view.renderComponents();
                this.trigger("updated");
            }, this);
            return this.load();
        },
    }, {
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
        }
    });

    return Template;
});