define([
    "hr/utils",
    "ht/promise",
    "hr/class"
], function(_, Q, Class) {
    var TaskWorker = Class.extend({
        initialize: function() {
            TaskWorker.__super__.initialize.apply(this, arguments);

            this.worker = null;
            this.methods = {};
        },

        // Init caller worker
        getRemoteWorker: function() {
            var that = this;

            if (!this.worker) {
                this.worker = new Worker(this.options.worker);

                this.worker.addEventListener('message', function(e) {
                    that.trigger("task:"+e.data.id, e.data);
                }, false);
            }
            return this.worker;
        },

        // Call a metod from the worker
        callMethod: function(method) {
            var d = Q.defer();

            var taskId = _.uniqueId("task");
            var args = {
                id: taskId,
                method: method,
                arguments: Array.prototype.slice.call(arguments)
            };

            var wk = this.getRemoteWorker();

            this.once("task:"+taskId, function(data) {
                if (data.rejected) {
                    d.reject(data.rejected);
                } else {
                    d.resolve(data.resolved);
                }
            });

            return d.promise;
        },

        // Register a method
        register: function(method, handler) {
            var that = this;

            this.methods[method] = function() {
                var args = Array.prototype.slice.apply(arguments);

                return Q()
                .then(function() {
                    return handler.apply(that, args);
                });
            };
        },

        // Run in the owrker
        run: function() {
            var that = this;

            addEventListener('message', function(e) {
                var wk = this;

                var data = e.data;
                var method = data.method;
                var taskId = data.id;
                var args = data.arguments || [];

                if (!method || !taskId) return;

                Q()
                .then(function() {
                    if (!that.methods[method]) throw "Method doesn't exist: "+method;

                    return that.methods[method].apply(that, args);
                })
                .then(function(r) {
                    return {
                        resolved: r
                    };
                }, function(err) {
                    return {
                        rejected: err
                    };
                })
                .then(function(r) {
                    r.id = taskId;
                    wk.postMessage(r);
                })
            }, false);
        }
    });

    return TaskWorker;
});