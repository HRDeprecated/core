define([
    "hr/utils",
    "hr/promise",
    "hr/class"
], function(_, q, Class) {
    var Queue = Class.extend({
        /*
         *  Initialize
         */
        initialize: function() {
            this.tasks = [];
            this.empty = true;

            this.defaultTask = this.options.task;
            this.defaultContext = this.options.context;

            return this;
        },

        /*
         *  Add tasks
         *  @task : function task
         *  @args : args to the task
         *  @context : context to the task
         */
        defer: function(task, context, args) {
            // can used to default task
            if (!_.isFunction(task)) {
                args = task;
                task = null;
                context = null;
            }

            if (!_.isArray(args)) args = [args];

            var d = Q.defer();
            this.tasks.push({
                "task": task,
                "args": args || [],
                "context": context,
                "result": d
            });
            if (this.empty == true) {
                this.startNext();
            }
            return d.promise;
        },

        /*
         *  Start a task
         *  @task task object to start
         */
        startTask: function(task) {
            var f = task.task || this.defaultTask;

            Q(f.apply(task.context || this.defaultContext, task.args)).then(function() {
                task.result.resolve.apply(task.result, arguments);
            }, function() {
                task.result.reject.apply(task.result, arguments);
            }).fin(_.bind(this.startNext, this));
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