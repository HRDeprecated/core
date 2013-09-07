define([
    "hr/shims",
    "hr/configs",
    "hr/core/class",
    "hr/core/view",
    "hr/core/application",
    "hr/core/head",
    "hr/core/history",
    "hr/core/router",
    "hr/core/model",
    "hr/core/collection",
    "hr/core/list",

    "hr/utils/logger",
    "hr/utils/requests",
    "hr/utils/urls",
    "hr/utils/storage",
    "hr/utils/cache",
    "hr/utils/template",
    "hr/utils/resources",
    "hr/utils/deferred",
    "hr/utils/queue",
    "hr/utils/i18n",
    "hr/utils/views",

    "hr/vendors/underscore-more"
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
                Logger.logging.error("Error invalid configuration for hr");
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