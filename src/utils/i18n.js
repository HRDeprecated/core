define([
    "jQuery",
    "Underscore",
    "yapp/configs",
    "yapp/utils/urls",
    "yapp/utils/logger",
    "yapp/utils/ressources",
    "yapp/utils/deferred"
], function($, _, configs, Urls, Logger, Ressources, Deferred) {
    var logging = Logger.addNamespace("i18n");
    var I18n = {};

    // Set default locale to english
    I18n.defaultLocale = "en";

    // Set default separator
    I18n.defaultSeparator = ".";

    // Set current locale to null
    I18n.locale = null;

    I18n.interpolate = function(message, options) {
        options = options || {};
        
        var compiled = _.template(message);

        _.extend(options, {
            "_": _,
            "yapp": {
                "configs": configs,
                "urls": Urls
            }
        });
        return compiled(options);
    };

    I18n.currentLocale = function() {
        return (I18n.locale || I18n.defaultLocale);
    };

    I18n.setCurrentLocale = function(lang) {
        I18n.locale = lang;
    };

    I18n.loadLocale = function(lng) {
        if (_.isArray(lng)) {
            var d = [];
            _.each(lng, function(lang) {
                d.push(I18n.loadLocale(lang));
            });
            return Deferred.when.apply(Deffered, d);
        }
        return Ressources.load("i18n", lng).then(function(content) {
            if (_.isString(content)) content = JSON.parse(content);
            I18n.translations[lng] = content;
        }, function() {
            logging.error("Error loading locale "+lng);
        });
    };

    I18n.missingTranslation = function() {
        var message = '[missing "' + this.currentLocale()
            , count = arguments.length
        ;

        for (var i = 0; i < count; i++) {
            message += "." + arguments[i];
        }

        message += '" translation]';

        return message;
    };

    I18n.lookup = function(scope, options) {
        var options = options || {}
            , lookupInitialScope = scope
            , translations = I18n.translations
            , locale = options.locale || I18n.currentLocale()
            , messages = translations[locale] || {}
            , currentScope
        ;

        console.log(translations, locale);
        
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

    I18n.translate = function(scope, options) {
        var translation = this.lookup(scope, options);

        try {
            return this.interpolate(translation, options);
        } catch(err) {
            logging.error(err);
            return this.missingTranslation(scope);
        }
    };

    I18n.translations = {};
    I18n.t = I18n.translate;

    I18n.defaultLocale = configs.defaultLocale;
    I18n.locale = configs.defaultLocale;


    return I18n;
});