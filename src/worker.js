define([
    "hr/utils",
    "hr/promise",
    "hr/class"
], function(_, Q, Class) {
    var TaskWorker = Class.extend({
        initialize: function() {
            TaskWorker.__super__.initialize.apply(this, arguments);

            this.worker = null;
            this.workerLoading = null;
            this.methods = {};
        },

        // Init caller worker
        getRemoteWorker: function() {
            var that = this;

            if (this.workerLoading) return this.workerLoading;
            if (this.worker) return Q(this.workerLoading);


            var d = Q.defer();
            this.workerLoading = d.promise;

            this.worker = new Worker(this.options.worker);
            this.worker.postMessage();
            this.worker.addEventListener('message', function(e) {
                if (e.data.message == "ready") {
                    d.resolve(that.worker);
                } else {
                    that.trigger("task:"+e.data.id, e.data);
                }
            }, false);

            return this.workerLoading;
        },

        // Call a metod from the worker
        callMethod: function(method) {
            var that = this;
            var args = Array.prototype.slice.call(arguments, 1);

            return that.getRemoteWorker()
            .then(function(wk) {
                var d = Q.defer();

                var taskId = _.uniqueId("task");
                var msg = {
                    id: taskId,
                    method: method,
                    arguments: args
                };

                that.once("task:"+taskId, function(data) {
                    if (data.rejected) {
                        d.reject(new Error(data.rejected));
                    } else {
                        d.resolve(data.resolved);
                    }
                });

                wk.postMessage(msg)

                return d.promise;
            });
        },

        // Return a method as a function ca be called
        method: function(method) {
            return _.partial(this.callMethod.bind(this), method);
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

            // Handle message from app
            addEventListener('message', function(e) {
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
                    r.message = "result";
                    postMessage(r);
                })
            }, false);

            // Signal that the worker is ready
            postMessage({ message: "ready" })
        }
    });

    return TaskWorker;
});