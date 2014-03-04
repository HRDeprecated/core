define([
    "hr/utils",
], function(_) {
    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    /*
     *  hr.Class is the base for objects in hr
     */
    var Class = function(options) {
        this.options = _.extend({}, options || {});
        _.defaults(this.options, this.defaults);
        this.cid = _.uniqueId('class');
        this.initialize.apply(this, arguments);
    };

    /*
     * Class.extend is used for herited from this class
     *  exemples:
     *      Class.extend(Class1, staticProps)
     *      Class.extend([Class1, Class2], staticProps)
     */
    Class.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    Class = Class.extend({
        /*
         *  Default options for this.options in the class object
         */
        defaults: {},

        /*
         *  This method is a kind of constructor in class definition.
         */
        initialize: function() {
            return this;
        },

        /*
         *  Bind an event to a `callback` function. Passing `"all"` will bind
         *  the callback to all events fired.
         */
        on: function(name, callback, context) {
            if (!this.multipleEvents('on', name, [callback, context]) || !callback) return this;
            this._events = this._events || {};
            this._events[name] = this._events[name] || [];
            this._events[name].push({
                callback: callback,
                context: context,
                ctx: context || this
            });
            return this;
        },

        /*
         *  Bind an event to only be triggered a single time. After the first time
         *  the callback is invoked, it will be removed.
         */
        once: function(name, callback, context) {
            if (!this.multipleEvents('once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function() {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        /*
         *  Remove one or many callbacks. If `context` is null, removes all
         *  callbacks with that function. If `callback` is null, removes all
         *  callbacks for the event. If `name` is null, removes all bound
         *  callbacks for all events.
         */
        off: function(name, callback, context) {
            if (!this._events || !this.multipleEvents('off', name, [callback, context])) return this;

            // Remove all callbacks for all events.
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }

            var names = name ? [name] : _.keys(this._events);
            for (var i = 0, length = names.length; i < length; i++) {
                name = names[i];

                // Bail out if there are no events stored.
                var events = this._events[name];
                if (!events) continue;

                // Remove all callbacks for this event.
                if (!callback && !context) {
                    delete this._events[name];
                    continue;
                }

                // Find any remaining events.
                var remaining = [];
                for (var j = 0, k = events.length; j < k; j++) {
                    var event = events[j];
                    if (
                        callback && callback !== event.callback &&
                        callback !== event.callback._callback ||
                        context && context !== event.context
                    ) {
                        remaining.push(event);
                    }
                }

                // Replace events if there are any remaining.  Otherwise, clean up.
                if (remaining.length) {
                    this._events[name] = remaining;
                } else {
                    delete this._events[name];
                }
            }

            return this;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;

            var remove = !name && !callback;
            if (!callback && typeof name === 'object') callback = this;
            if (obj) (listeningTo = {})[obj.cid] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
            }
            return this;
        },

        /*
         *  Trigger one or many events, firing all bound callbacks. Callbacks are
         *  passed the same arguments as `trigger` is, apart from the event name
         *  (unless you're listening on `"all"`, which will cause your callback to
         *  receive the true name of the event as the first argument).
         */
        triggerOnly: function(name) {
            if (!this._events) return this;
            var args = Array.prototype.slice.call(arguments, 1);
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) this.triggerEvents(events, args);
            if (allEvents) this.triggerEvents(allEvents, arguments);
            return this;
        },
        trigger: function(name) {
            var args = Array.prototype.slice.call(arguments, 0);
            if (!this.multipleEvents('trigger', name, args)) return this;
            var index = 0;
             
            do {
                index = name.indexOf(':', index+1);
                args[0] = name.slice(0, index === -1 ? undefined : index);
                this.triggerOnly.apply(this, args);
            } while(index !== -1)
            return this;
        },
        triggerEvents: function(events, args) {
            var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
            switch (args.length) {
                case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
                case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
                case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
                case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
                default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
            }
        },

        /*
         *  Implement fancy features of the Events API such as multiple event
         *  names `"change blur"` and jQuery-style event maps `{change: action}`
         *  in terms of the existing API.
        */
        multipleEvents: function(action, name, rest) {
            if (!name) return true;

            // Handle event maps.
            if (typeof name === 'object') {
                for (var key in name) {
                    this[action].apply(this, [key, name[key]].concat(rest));
                }
                return false;
            }

            // Handle space separated event names.
            if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, l = names.length; i < l; i++) {
                    this[action].apply(this, [names[i]].concat(rest));
                }
                return false;
            }

            return true;
        }
    });

    // Inversion-of-control versions of `on` and `once`. Tell *this* object to
    // listen to an event in another object ... keeping track of what it's
    // listening to.
    var listenMethods = {
        listenTo: 'on',
        listenToOnce: 'once'
    };
    _.each(listenMethods, function(implementation, method) {
        Class.prototype[method] = function(obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj.cid;
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') callback = this;
            obj[implementation](name, callback, this);
            return this;
        };
    });

    Class.prototype.bind   = Class.prototype.on;
    Class.prototype.unbind = Class.prototype.off;


    return Class;
})