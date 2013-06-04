define([
    "Underscore",
    "yapp/configs"
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
        route: function(route, args) {
            args = args || {};
            var url = route;
            _.map(args, function(value, attr) {
                url = url.replace("\:"+attr, value);
            });
            if (configs.router.mode == "hashs") url = "#/"+url;
            return Urls.base(url);
        }
    };

    return Urls;
});