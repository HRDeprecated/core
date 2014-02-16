define([
    "hr/utils",
    "hr/configs"
], function(_, configs) {
    var Urls = {
        /*
         *  Join paths
         *  *args : parts to join
         */
        join: function() {
            var parts = Array.prototype.slice.call(arguments, 0);
            return Urls.normalize(parts.join('/'));
        },

        /*
         *  Normalize an url
         *  @url : url to normalize
         */
        normalize: function (url) {
            return url
                .replace(/[\/]+/g, '/')
                .replace(/\/\?/g, '?')
                .replace(/\/\#/g, '#')
                .replace(/\:\//g, '://');
        },

        /*
         *  Return a url relative to this application
         *
         */
        base: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0,0, configs.baseUrl);
            return Urls.join.apply(Urls, args);
        },

        /*
         *  Return a static url for the given ressource
         *  *args : parts to join
         */
        static: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0,0, configs.staticDirectory);
            return Urls.base.apply(Urls, args);
        },

        /*
         *  Transform a route in an url
         *  @route : route to transform
         *  @args : args for the route
         */
        route: function(route, args, base) {
            base = base || "";
            args = args || {};
            var url = route;
            url = url.replace("#!/","#").replace("#!", "#").replace("#", "");
            _.map(args, function(value, attr) {
                url = url.replace("\:"+attr, value);
            });
            return base+"#/"+url;
        },

        /*
         *  Extend rules
         *  @rules : map of rules
         */
        extendRules: function(rules) {
            _.extend(Urls, rules);
        },

        /*
         *  Redirect the user
         */ 
        redirect: function(route, rule) {
            if (rule == null) rule = "base";
            if (_.isString(rule)) rule = Urls[rule];
            route = rule(route);
            window.location.href = route;
        }
    };

    return Urls;
});