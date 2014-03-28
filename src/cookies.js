/**
 * @module hr/cookies
 */
define([
    "hr/utils",
    "hr/configs",
    "hr/logger"
], function(_, configs, Logger) {
    var logging = Logger.addNamespace("cookies");

    /**
     * @class Cookies
     */
    var Cookies = {
        /**
         * Read a cookie.
         *
         * @method get
         * @param {string} name name of the cookie to read
         * @return {string} value of the cookie or null
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

        /**
         * Write a cookie.
         *
         * @method set
         * @param {string} name name of the cookie to write
         * @param {string} value new value for the cookie
         * @param {number} [days] number of days before expiration
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

        /**
         * Remove a data from the cookies.
         *
         * @method remove
         * @param {string} name name of the cookie to remove
         */
        remove: function(name) {
            return Cookies.set(name, "", -1);
        },

        /**
         * Clear the all cookie storage.
         *
         * @method clear
         */
        clear: function() {
            document.cookie = "";
            return true;
        },
    };

    return Cookies;
});