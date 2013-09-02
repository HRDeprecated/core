define([
    "yapp/shims",
    "yapp/configs",
    "yapp/core/class",
    "yapp/core/view",
    "yapp/core/application",
    "yapp/core/head",
    "yapp/core/history",
    "yapp/core/router",
    "yapp/core/model",
    "yapp/core/collection",
    "yapp/core/list",

    "yapp/utils/logger",
    "yapp/utils/requests",
    "yapp/utils/urls",
    "yapp/utils/storage",
    "yapp/utils/cache",
    "yapp/utils/template",
    "yapp/utils/resources",
    "yapp/utils/deferred",
    "yapp/utils/queue",
    "yapp/utils/i18n",
    "yapp/utils/views",

    "yapp/vendors/underscore-more"
], function(shims, configs, 
Class, View, Application, Head, History, Router, Model, Collection, ListView,
Logger, Requests, Urls, Storage, Cache, Template, Resources, Deferred, Queue, I18n, views) {    
    return {
        configs: configs,
        Class: Class,
        View: View,
        Application: Application,
        Head: Head,
        Router: Router,
        Model: Model,
        Collection: Collection,
        List: ListView,
        History: History,

        Logger: Logger,
        Storage: Storage,
        Cache: Cache,
        Requests: Requests,
        Urls: Urls,
        Template: Template,
        Resources: Resources,
        Deferred: Deferred,
        Queue: Queue,
        I18n: I18n,
        views: views,

        app: null,

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