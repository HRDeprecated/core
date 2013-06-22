define([
    "Underscore",
    "yapp/configs",
    "yapp/core/class",
    "yapp/utils/logger",
    "yapp/utils/urls",
    "yapp/utils/ressources",
    "yapp/utils/i18n"
], function(_, configs, Class, Logger, Urls, Ressources, I18n) {
    var Template = Class.extend({
        defaults: {
            /* Template id */
            template: null,

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
                "yapp": {
                    "configs": configs,
                    "urls": Urls,
                    "i18n": I18n,
                    "utils": {
                        "timeago": function(timestamp) {
                            var current_timestamp = (new Date()).getTime() / 1000;
                            var distance_in_minutes = Math.round((current_timestamp - timestamp)/60);

                            var msgid = "error";
                            
                            if (distance_in_minutes < 0) {
                                distance_in_minutes = 0;
                            }
                            
                            if (distance_in_minutes < 1051199) { msgid = 'yearago'; }
                            if (distance_in_minutes < 525960) { msgid =  'months'; }
                            if (distance_in_minutes < 86400) { msgid = 'month'; }
                            if (distance_in_minutes < 43200) { msgid =  'days'; }
                            if (distance_in_minutes < 2880) { msgid = 'day'; }
                            if (distance_in_minutes < 1440) { msgid = 'hours'; }
                            if (distance_in_minutes < 90) { msgid = 'hour'; }
                            if (distance_in_minutes < 45) { msgid =  'minutes'; }
                            if (distance_in_minutes == 1) { msgid = 'minute'; }
                            if (distance_in_minutes == 0) { msgid = 'seconds'; }

                            return I18n.t("yapp.utils.timeago."+msgid, {
                                "months": Math.floor(distance_in_minutes / 43200),
                                "days": Math.floor(distance_in_minutes / 1440),
                                "hours": Math.round(distance_in_minutes / 60),
                                "minutes": distance_in_minutes
                            });
                        }
                    }
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
                    "import": function(name, args) {
                        return this.args.view.component("template", {template: name, args: args}, name);
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
            if (this.content != null) this.generate = _.template(this.content);
            return this;
        },

        /*
         *  Load template content
         */
        load: function(template) {
            var self = this;
            this.template = template || this.template;
            Ressources.load("templates", this.template).then(function(content) {
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
            if (this.view != null) el = el || this.view.$el;
            this.on("loaded", function() {
                if (this.content == null) return;
                if (this.view != null) this.view.clearComponents();
                el.html(this.generate(this.args));
                if (this.view != null) this.view.renderComponents();
                this.trigger("updated");
            }, this);
            return this.load();
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