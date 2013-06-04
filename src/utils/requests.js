define([
    "yapp/configs",
    "yapp/core/class",
    "yapp/utils/logger"
], function(configs, Class, Logger) {
    
    var logging = Logger.logging.addType("requests");

    var Requests = Class.extend({
        defaults: {
            url: null,
            method: "GET",
            params: {},
            dataType: "text"
        },

        /*
         *  Execute the request
         */
        execute: function() {
            this.xhr = $.ajax({
                "type":     this.options.method,
                "url":      this.options.url,
                "data":     this.options.params,
                "dataType": this.options.dataType,
                "context":  this,
                "success":  function(data) {
                    logging.debug("Result for request ", this.options);
                    this.trigger("done", data);
                },
                "error": function() {
                    logging.error("Error for request ", this.options);
                    this.trigger("error");
                }
            });
            return this;
        }
    }, {
        /*
         *  Execute a request
         */
        _execute: function(url, callback, options, defaults) {
            options = options || {};
            options = _.extend(options, defaults, {
                "url": url
            });
            var r = new Requests(options);
            r.on("done", callback);
            r.on("error", _.partial(callback, null));
            return r.execute();
        },

        /*
         *  Method for a GET method
         *  @url : url to request 
         *  @args : arguments for GET
         *  @callback : callback for results
         */
        get: function(url, args, callback, options) {
            return Requests._execute(url, callback, options, {
                method: "GET",
                params: args
            });
        },

        /*
         *  Method for a POST method
         *  @url : url to request 
         *  @args : arguments for POST
         *  @callback : callback for results
         */
        post: function(url, args, callback, options) {
            return Requests._execute(url, callback, options, {
                method: "POST",
                params: args
            });
        }
    });
    return Requests;
});