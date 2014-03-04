define([
    "hr/dom",
    "hr/utils",
    "hr/promise",
    "hr/class",
    "hr/logger",
    "hr/queue",
    "hr/template"
], function($, _, q, Class, Logger, Queue, Template) {
    var logging = Logger.addNamespace("templates");
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    
    var View = Class.extend({
        tagName: "div",
        template: null,
        templateLoader: "templates",

        /*
         *  Initialize a view
         */
        initialize: function(options, parent) {
            View.__super__.initialize.call(this, options);
            this._ensureElement();
            this.delegateEvents();

            // Rendering queue
            this.renderQueue = new Queue();

            // Components map
            this.components = {};

            // parent view
            this.parent = parent || this;

            // Model
            this.model = this.options.model || null;

            // View state
            this.is_ready = false;

            // Counter for number of active components
            this.countComponents = 0;
            return this;
        },

        /*
         *  Remove the view from the DOM
         */
        remove: function() {
            this.undelegateEvents();
            this.$el.remove();
            this.stopListening();
            this.off();
            return this;
        },

        /*
         *  Detach the view from the dom (to be reinserted later)
         */
        detach: function() {
            // Signal detachment
            this.trigger("detach");

            // Detach dom el
            this.$el.detach();
            return this;
        },

        /*
         *  Append view
         */
        appendTo: function(el) {
            if (!(el instanceof $)) {
                el = el.$el;
            }
            this.$el.appendTo(el);
            return this;
        },

        /*
         *  jQuery delegate for the element of this view
         */
        $: function(selector) {
            return this.$el.find(selector);
        },

        /*
         *  Define DOM element for this view
         */
        setElement: function(element, delegate) {
            if (this.$el) this.undelegateEvents();
            this.$el = element instanceof $ ? element : $(element);
            this.el = this.$el[0];
            if (delegate !== false) this.delegateEvents();
            return this;
        },

        /*
         *  Ensure that the view has a DOM element
         */
        _ensureElement: function() {
            if (!this.el) {
                var attrs = _.extend({}, _.result(this, 'attributes'));
                if (this.id) attrs.id = _.result(this, 'id');
                if (this.className) attrs['class'] = _.result(this, 'className');
                var $el = $('<' + _.result(this, 'tagName') + '>').attr(attrs);
                this.setElement($el, false);
            } else {
                this.setElement(_.result(this, 'el'), false);
            }
        },

        /*
         *  Set callbacks, where `this.events` is a hash of {"event selector": "callback"}
         */
        delegateEvents: function(events) {
            if (!(events || (events = _.result(this, 'events')))) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) continue;

                var match = key.match(delegateEventSplitter);
                var eventName = match[1], selector = match[2];
                method = _.bind(method, this);
                eventName += '.delegateEvents' + this.cid;
                if (selector === '') {
                    this.$el.on(eventName, method);
                } else {
                    this.$el.on(eventName, selector, method);
                }
            }
            return this;
        },

        /*
         *  Clears all callbacks previously bound to the view with `delegateEvents`.
         */
        undelegateEvents: function() {
            this.$el.off('.delegateEvents' + this.cid);
            return this;
        },

        /*
         *  Finish rendering process
         */
        finish: function() {
            this.trigger("render");
            return this;
        },

        /*
         *  Signal the view is ready
         */
        ready: function() {
            this.delegateEvents();
            this.finish();
            if (!this.is_ready) {
                this.trigger("ready");
                this.is_ready = true;
            }
            return this;
        },

        /*
         *  Empty the view html and prevent sub components
         */
        empty: function() {
            // Detach components
            this.eachComponent(function(component) {
                component.remove();
            }, this);

            // Empty the dom
            this.$el.empty();
            return this;
        },

        /*
         *  Wait after rendering
         *  The callback will be call only when the view is ready
         */
        defer: function(callback) {
            var d = Q.defer();
            if (_.isFunction(callback)) d.promise.done(callback);

            this.on("ready", function() {
                d.resolve(this);
            }, this);
            if (this.is_ready) d.resolve(this);

            return d.promise;
        },

        /*
         *  Render view
         */
        render: function() {
            var tpl = _.result(this, 'template')
            if (tpl) return this.renderTemplate(tpl);
        },

        /*
         *  Update rendering
         */
        update: function() {
            return this.renderQueue.defer(this.render, this);
        },

        /*
         *  Return context for template
         */
        templateContext: function() {
            return this.options;
        },

        /*
         *  Add component to this view
         *  @name : component name
         *  @view : view for the component
         */
        addComponent: function(name, view) {
            view.parent = this;

            if (this.components[name] != null) {
                if (!_.isArray(this.components[name])) this.components[name] = [this.components[name]];
                this.components[name].push(view);
            } else {
                this.components[name] = view;
            }
            this.countComponents = this.countComponents + 1;
            return this;
        },

        /*
         *  Clear components
         */
        clearComponents: function() {
            this.eachComponent(function(view) {
                view.remove();
            });
            this.countComponents = 0;
            this.components = {};
            this.trigger("components:clear");
            return this;
        },

        /*
         *  Add components to elements
         */
        renderComponents: function() {
            var n_components = 0;
            var componentRendered = _.bind(function() {
                n_components = n_components + 1;
                if (n_components >= this.countComponents) {
                    this.ready();
                }
            }, this);

            if (_.size(this.components) == 0) { this.ready(); return this; }

            var addComponent = _.bind(Q.fbind(function(component) {
                this.$("component[data-component='"+component.cid+"']").replaceWith(component.$el);
                component.defer(_.once(componentRendered));

                return Q.try(function() {
                    component.update();
                }).fail(function(err) {
                    logging.exception(err, "Error rendering component:");
                })
            }), this);
            
            _.each(this.components, function(value, cid) {
                if (_.isArray(value)) {
                    _.each(value, addComponent);
                } else {
                    addComponent(value);
                }
            });

            this.trigger("components:render");
            return this;   
        },

        /*
         *  Iterate over the list of components
         */
        eachComponent: function(iterator, context) {
            if (context != null) iterator = _.bind(iterator, context);
            _.each(this.components, function(value, cid) {
                if (_.isArray(value)) {
                    _.each(value, iterator);
                } else {
                    iterator(value);
                }
            });
            return this;
        },

        /*
         *  Render template in view
         *  @tplname : template id
         *  @tplargs : contexts for template (if null, use templateContext)
         */
        renderTemplate: function(tplname, tplargs, tplloader) {
            tplname = tplname || this.template;
            tplargs = tplargs || _.result(this, "templateContext");
            tplloader = tplloader || _.result(this, "templateLoader");

            var tpl = new Template({
                template: tplname,
                args: tplargs,
                loader: tplloader,
                view: this
            });
            return tpl.render();
        }
    }, {
        Template: Template
    });


    /*
     *  This view is a simple component for importing template
     *  in a template.
     *  <%= view.component("template", {name: "mytemplate", args: {}}) %>
     */
    View.Template.registerComponent("template", View.extend({
        template: function() {
            return this.options.template;
        },
        templateContext: function() {
            return this.options.args;
        },
    }));

    return View;
});