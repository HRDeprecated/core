define([
    "yapp/configs",
    "yapp/core/class",
    "yapp/core/view",
    "yapp/core/application",
    "yapp/core/head",
    "yapp/core/router",
    "yapp/core/model",
    "yapp/core/collection",

    "yapp/utils/logger",
    "yapp/utils/requests",
    "yapp/utils/urls",
    "yapp/utils/storage",
    "yapp/utils/cache",
    "yapp/utils/template",
    "yapp/utils/ressources",
    "yapp/utils/deferred",
    "yapp/utils/i18n",

    "yapp/vendors/underscore-more"
], function(configs, 
Class, View, Application, Head, Router, Model, Collection,
Logger, Requests, Urls, Storage, Cache, Template, Ressources, Deferred, I18n) {
    return {
        configs: configs,
        Class: Class,
        View: View,
        Application: Application,
        Head: Head,
        Router: Router,
        Model: Model,
        Collection: Collection,

        Logger: Logger,
        Storage: Storage,
        Cache: Cache,
        Requests: Requests,
        Urls: Urls,
        Template: Template,
        Ressources: Ressources,
        Deferred: Deferred,
        I18n: I18n,

        configure: function(args, options) {
            options = options || {};
            args = args || {};
            if (args.revision == null) {
                Logger.logging.error("Error invalid configuration for yapp");
                return;
            }

            configs.extend(options, {
                revision: args.revision,
                args: args,
                baseUrl: args.baseUrl || ""
            });
        }
    }
})