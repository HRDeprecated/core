define([
    "hr/utils",
    "hr/configs",
    "hr/logger"
], function(_, configs, Logger) {
    var logging = Logger.addNamespace("cookies");

    var Cookies = {
        /*
         *  Read a cookie
         *  @name: cookie name to read
         */
        get: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        },

        /*
         *  Set a cookie data
         *  @name : key of the data to set
         *  @value : value for the key
         */
        set: function(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";

            document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
        },

        /*
         *  Remove a data from the cookies
         *  @key : key of the data to remove
         */
        remove: function(name) {
            return Cookies.set(name, "", -1);
        },

        /*
         *  Clear the all storage
         */
        clear: function() {
            document.cookie = "";
            return true;
        },
    };

    return Cookies;
});