define([
    "Underscore",
    "hr/core/class",
    "hr/utils/deferred"
], function(_, Class, Deferred) {
    var Queue = Class.extend({
        /*
         *  Initialize
         */
        initialize: function() {
            this.tasks = [];
            this.empty = true;
            return this;
        },

        /*
         *  Add tasks
         *  @task : function task
         *  @args : args to the task
         *  @context : context to the task
         */
        defer: function(task, context, args) {
            var d = new Deferred();
            this.tasks.push({
                "task": task,
                "args": args || [],
                "context": context,
                "result": d
            });
            if (this.empty == true) {
                this.startNext();
            }
            return d;
        },

        /*
         *  Start a task
         *  @task task object to start
         */
        startTask: function(task) {
            var d = task.task.apply(task.context, task.args);
            if (!(d instanceof Deferred)) {
                task.result.resolve(d)
                this.startNext();
            } else {
                d.then(function() {
                    task.result.resolve.apply(task.result, arguments);
                }, function() {
                    task.result.reject.apply(task.result, arguments);
                });
                d.always(_.bind(this.startNext, this));
            }
        },

        /*
         *  Start next task
         */
        startNext: function() {
            if (_.size(this.tasks) > 0) {
                this.empty = false;
                var task = this.tasks.shift();
                this.startTask(task);
                this.trigger("tasks:next");
            } else {
                this.empty = true;
                this.trigger("tasks:finish");
            }      
        },

        /*
         *  Return queue size
         */
        size: function() {
            return _.size(this.tasks);
        },

        /*
         *  Return true if tasks queue is finish
         */
        isComplete: function() {
            return this.empty == true;
        }
    });

    return Queue;
});