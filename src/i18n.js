/**
 * @module hr/i18n
 */
define([
    "hr/utils",
    "hr/promise",
    "hr/configs",
    "hr/urls",
    "hr/logger",
    "hr/resources"
], function(_, Q, configs, Urls, Logger, Resources) {
    var logging = Logger.addNamespace("i18n");

    /**
     * @class i18n
     */
    var i18n = {};

    /**
     * Default locale to fallback to (default is english).
     *
     * @property {string} defaultLocale
     * @private
     */
    i18n.defaultLocale = "en";

    /**
     * Default separator.
     *
     * @property {string} defaultSeparator
     * @private
     * @default "."
     */
    i18n.defaultSeparator = ".";

    /**
     * Current language
     *
     * @property {string} locale
     * @private
     * @default null
     */
    i18n.locale = null;

    /**
     * List of loaded languages
     *
     * @property {array} locales
     * @private
     * @default []
     */
    i18n.locales = [];

    /**
     * Calcul the output of a message with some options
     *
     * @method interpolate
     * @param {string} message message to interpolate
     * @param {object} options options to pass for interpolation
     * @return {string} message interpolated with options
     */
    i18n.interpolate = function(message, options) {
        options = options || {};

        var compiled = _.template(message);

        _.extend(options, {
            "_": _,
            "hr": {
                "configs": configs,
                "urls": Urls
            }
        });
        return compiled(options);
    };

    /**
     * Return current language if set or default language
     *
     * @method currentLocale
     * @return {string}
     */
    i18n.currentLocale = function() {
        return (i18n.locale || i18n.defaultLocale);
    };

    /**
     * Set current language
     *
     * @method setCurrentLocale
     * @param {string} lang new language to set
     */
    i18n.setCurrentLocale = function(lang) {
        i18n.locale = lang;
    };

    /**
     * Load a language using Resources loader
     *
     * @method loadLocale
     * @param {string} lng language to load
     * @param {object} options options for loading
     */
    i18n.loadLocale = function(lng, options) {
        options = _.defaults({}, options || {}, {
            'loader': 'i18n'
        });

        if (!_.isArray(lng)) {
            lng = [lng];
        }

        return Q.all(_.map(lng, function(lang) {
            return Resources.load(options.loader, lang).then(function(content) {
                // use "eval" here because content is from a trusted source
                if (_.isString(content)) content = eval('(' + content + ')');
                i18n.translations[lang] = content;
                i18n.locales.push(lang);
                i18n.locales = _.uniq(i18n.locales);
            }, function() {
                logging.error("Error loading locale "+lng);
            });
        }));
    };

    i18n.missingTranslation = function() {
        var message = '[missing "' + this.currentLocale()
            , count = arguments.length
        ;

        for (var i = 0; i < count; i++) {
            message += "." + arguments[i];
        }

        message += '" translation]';

        return message;
    };

    i18n.lookup = function(scope, options) {
        var options = options || {}
            , lookupInitialScope = scope
            , translations = i18n.translations
            , locale = options.locale || i18n.currentLocale()
            , messages = translations[locale] || {}
            , currentScope
        ;

        if (typeof(scope) == "object") {
            scope = scope.join(this.defaultSeparator);
        }

        if (options.scope) {
            scope = options.scope.toString() + this.defaultSeparator + scope;
        }

        scope = scope.split(this.defaultSeparator);

        while (messages && scope.length > 0) {
            currentScope = scope.shift();
            messages = messages[currentScope];
        }

        return messages;
    };

    /**
     * Translate a scope
     *
     * @method translate
     * @param {string} scope scope message to translate
     * @param {object} options options to pass for translation
     * @return {string} message translated
     */
    i18n.translate = function(scope, options) {
        var translation = this.lookup(scope, options);

        try {
            return this.interpolate(translation, options);
        } catch(err) {
            logging.error(err);
            return this.missingTranslation(scope);
        }
    };

    i18n.translations = {};
    i18n.t = i18n.translate;

    i18n.defaultLocale = configs.defaultLocale;
    i18n.locale = configs.defaultLocale;


    return i18n;
});