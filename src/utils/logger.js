define([
    "yapp/configs",
    "yapp/core/class"
], function(configs, Class) {
    var Logger = Class.extend({
        /*
         *  Initialize
         */
        initialize: function() {
            this.handler = this.options.handler || console;
            return this;
        },

        /*
         *  Print informations
         *  @section : section for the log
         *  @type : debug, error, warning
         *  @*args : data to be log
         */
        printLog: function(section, type) {
            var args = Array.prototype.slice.call(arguments, 2);
            if (this.logLevel(type) < this.logLevel(configs.logLevel)) {
                return this;
            }
            args.splice(0, 0, "[" + section + "] [" + type + "]");
            var logMethod = Function.prototype.bind.call(this.handler[type], this.handler);
            logMethod.apply(this.handler[type], args);
        },

        /*
         *  Add log type
         *  @section : section for the log method
         *  @type for he log method
         */
        addType: function(section, type) {
            if (type == null) {
                this[section] = {};
                _.each(Logger.levels, function(level, tag) {
                    this.addType(section, tag);
                }, this);
                return this[section];
            }

            var name = type;
            this[section] = this[section] || {};
            this[section][name] = _.bind(function() {
                var args = Array.prototype.slice.call(arguments, 0);
                args.splice(0, 0, section);
                args.splice(1, 0, type);
                return this.printLog.apply(this, args);
            }, this);
            return this[section][name];
        },

        /*
         *  Return log level for a log type
         *  @type : debug, error, warning
         *  @return : 0, 1, 2
         */
        logLevel: function(type) {
            return Logger.levels[type] || 0;
        }
    }, {
        levels: {
            "log": 0,
            "debug": 1,
            "warn": 2,
            "error": 3,
            "none": 4
        }
    });

    // Create default logger
    Logger.logging = new Logger();
    _.each(Logger.levels, function(level, tag) {
        Logger.logging[tag] = Logger.logging.addType("base", tag);
    });

    return Logger;
});