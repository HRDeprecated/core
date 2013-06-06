define([
    "Underscore",
    "yapp/core/class",
], function(_, Class) {
    /* 
    * Deferred is an implementation of the Promise pattern, which allows
    * for asynchronous events to be handled in a unified way across an
    * application. Deferred's are like callbacks on steroids.
    *
    * Rather than passing around callback functions, Deferred objects 
    * are passed around. Deferreds contain a queue of callback functions
    * and manage the state of the asychronous event.
    *
    * When calling an asynchronous function, all functions should return a 
    * Deferred object. The caller function, having received the Deferred
    * and having done whatever it wants to do, should also return that 
    * same Deferred when it exits, so that other parties have a chance to
    * interact with it.
    *
    * The Deferred object represents the completed state of a future event.
    * Interested parties can add a callback function to the Deferred that
    * will be called when the Deferred event is deemed complete.
    * 
    * When an asynchronous event is deemed completed, all the callbacks that
    * were added to the Deferred will be called in serial order. The return 
    * value of each callback is passed as a parameter to the next callback.
    * i.e., callback3(callback2(callback1( trigger(o) )))
    *
    * After the event is deemed completed and all the callbacks are called,
    * further callbacks which are added to the Deferred at a later stage 
    * will be executed immediately.
    */
    var Deferred = Class.extend({
        err: 0,
        x: 0,

        /* Constructor */
        initialize: function() {
            this.callbacks = [];
            return this;
        },

        /* Bind methods */
        _bind: function(arr) {
            this.callbacks.push(arr);
            this.x == 2 && this._call(this.o);
            return this
        },

        done: function(cb) {
            return this._bind([cb, 0])
        },

        fail: function(cb) {
            return this._bind([0, cb])
        },

        always: function(cb) {
            return this._bind([0, 0, cb])
        },

        then: function(cb, err) {
            return this._bind([cb, err])
        },


        /* Calls methods */
        reject: function(obj) {
            this.x || (this.err = 1, this._call(obj));
            return this
        },

        resolve: function(obj) {
            this.x || this._call(obj);
            return this
        },

        _call: function(obj) {
            this.x = 1;
            for(var state = this.err, cb = this.callbacks, method = cb.shift(), value = obj; method; ) {
                try {
                    while(method) {
                        (method = method[2] || (state ? method[1] : method[0])) && (value = method(value || obj));
                        if(value instanceof Deferred) {
                            var that = this;
                            value.always(function(v) {that._call(v || obj); return v});
                            return
                        }
                        method = cb.shift()
                    }
                } catch(e) {
                    state && (method = cb.shift()), this.err = state = 1
                }
            }
            this.o = value || obj;
            this.x = 2
        },
    }, {
        when: function(m, args) {
            if(!args) return m;

            args = [].slice.call(arguments);
            m = new Deferred;

            var i = args.length,
            n = i,
            res = [],
            done = function(j) {return function(v) {res[j] = v; --n || m.resolve(res)}},
            fail = function(v) {m.reject(v)};

            while(i--) args[i].then(done(i), fail);
            return m
        }
    });

    return Deferred;
});