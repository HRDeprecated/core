define([
    "hr/promise",
    "hr/configs",
    "hr/class",
    "hr/logger"
], function(Q, configs, Class, Logger) {
    
    var logging = Logger.addNamespace("requests");

    var Requests = Class.extend({
        defaults: {
            url: null,
            method: "GET",
            params: {},
            dataType: "text",
            options: {}
        },

        /*
         *  Execute the request
         */
        execute: function() {
            this.xhr = $.ajax(_.extend({}, {
                "type":     this.options.method,
                "url":      this.options.url,
                "data":     this.options.params,
                "dataType": this.options.dataType,
                "context":  this,
                "success":  function(data) {
                    logging.debug("Result for request ", this.options);
                    this.trigger("done", data);
                },
                "error": function(xhr, textStatus, errorThrown) {
                    logging.error("Error for request ", this.options);
                    this.trigger("error", {
                        'status': textStatus,
                        'error': errorThrown,
                        'content': xhr.responseText,
                        'xhr': xhr
                    });
                }
            }, this.options.options));
            return this;
        }
    }, {
        /*
         *  Execute a request
         */
        _execute: function(url, options, defaults) {
            var d = Q.defer();
            options = options || {};
            options = _.extend(options, defaults, {
                "url": url
            });
            var r = new Requests(options);
            r.on("done", function(content) {
                d.resolve(content);
            });
            r.on("error", function(err) {
                var e = new Error(err.textStatus+": "+err.content);
                e.textStatus = err.textStatus,
                e.httpRes = err.content;
                d.reject(e);
            });

            r.execute();
            return d.promise;
        },

        /*
         *  Method for a GET method
         *  @url : url to request 
         *  @args : arguments for GET
         *  @callback : callback for results
         */
        get: function(url, args, options) {
            return Requests._execute(url, options, {
                method: "GET",
                params: args
            });
        },

        /*
         *  Method for a GET method, suing JSONP
         *  @url : url to request 
         *  @args : arguments for GET
         *  @callback : callback for results
         */
        getJSON: function(url, args, options) {
            return Requests._execute(url, options, {
                method: "GET",
                params: args,
                dataType: "json"
            });
        },

        /*
         *  Method for a POST method
         *  @url : url to request 
         *  @args : arguments for POST
         *  @callback : callback for results
         */
        post: function(url, args, options) {
            return Requests._execute(url, options, {
                method: "POST",
                params: args
            });
        },

        /*
         *  Method for a PUT method
         *  @url : url to request 
         *  @args : arguments for PUT
         *  @callback : callback for results
         */
        put: function(url, args, options) {
            return Requests._execute(url, options, {
                method: "PUT",
                params: args
            });
        },

        /*
         *  Method for a DELETE method
         *  @url : url to request 
         *  @args : arguments for DELETE
         *  @callback : callback for results
         */
        delete: function(url, args, options) {
            return Requests._execute(url, options, {
                method: "DELETE",
                params: args
            });
        },

        /*
         *  Method for a HEAD method
         *  @url : url to request 
         *  @args : arguments for HEAD
         *  @callback : callback for results
         */
        head: function(url, args, options) {
            return Requests._execute(url, options, {
                method: "HEAD",
                params: args
            });
        }
    });
    return Requests;
});