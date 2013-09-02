define([
    "yapp/yapp",

    // Put resources for loader "require" here
    "text!resources/i18n/en.json",
    "text!resources/i18n/fr.json",
    "text!resources/i18n/de.json",
    "text!resources/i18n/it.json",
    "text!resources/i18n/es.json",
    "text!resources/i18n/ja.json",
    "text!resources/i18n/cn.json",
], function(yapp) {

    // Define loader for templates
    yapp.Resources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    // Define loader for i18n
    yapp.Resources.addNamespace("i18n", {
        loader: "require",
        base: "resources/i18n",
        extension: ".json"
    });

    yapp.I18n.loadLocale(["en", "fr", "de", "it", "es", "ja", "cn"]);

    return arguments;
});