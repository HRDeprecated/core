define([
    "jQuery",
    "Underscore",
    "yapp/core/class",
    "yapp/templates/base"
], function($, _, Class, Template) {

    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    
    var View = Class.extend({
        tagName: "div",
        template: null,

        /*
         *  Initialize a view
         */
        initialize: function() {
            this._ensureElement();
            this.delegateEvents();

            // Components map
            this.components = {};

            // parent view
            this.parent = null;

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
            this.$el.remove();
            this.stopListening();
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
            this.finish();
            if (!this.is_ready) {
                this.trigger("ready");
                this.is_ready = true;
            }
            return this;
        },

        /*
         *  Render view
         */
        render: function() {
            var tpl = _.result(this, 'template')
            if (tpl) return this.renderTemplate(tpl);
            return this;
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
                if (!_.isArray(this.components[name])) this.components[name] = [this.components[name]]
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

            var addComponent = function(component) {
                this.$("component[data-component='"+component.cid+"']").first().empty().append(component.$el);
                component.on("ready", _.once(componentRendered));
                component.render();
            };
            
            _.each(this.components, function(value, cid) {
                if (_.isArray(value)) {
                    _.each(value, _.bind(addComponent, this))
                } else {
                    addComponent(value);
                }
            });

            this.trigger("components:render");
            return this;   
        },

        /*
         *  Render template in view
         *  @tplname : template id
         *  @tplargs : contexts for template (if null, use templateContext)
         */
        renderTemplate: function(tplname, tplargs) {
            tplname = tplname || this.template;
            tplargs = tplargs || this.templateContext();

            var tpl = new Template({
                template: tplname,
                args: tplargs,
                view: this
            });
            tpl.render();

            return this;
        }
    }, {
        Template: Template
    });

    return View;
});