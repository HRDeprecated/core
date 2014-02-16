define([
    "hr/dom",
    "hr/utils",
    "hr/promise",
    "hr/configs",
    "hr/urls",
    "hr/logger",
    "hr/resources"
], function($, _, Q, configs, Urls, Logger, Resources) {
    var logging = Logger.addNamespace("i18n");
    var i18n = {};

    // Set default locale to english
    i18n.defaultLocale = "en";

    // Set default separator
    i18n.defaultSeparator = ".";

    // Set current locale to null
    i18n.locale = null;

    // Languages loaded
    i18n.locales = [];

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

    i18n.currentLocale = function() {
        return (i18n.locale || i18n.defaultLocale);
    };

    i18n.setCurrentLocale = function(lang) {
        i18n.locale = lang;
    };

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