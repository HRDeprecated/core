define([
    "yapp/yapp",

    // Put ressources for loader "require" here
    "text!ressources/i18n/en.json",
    "text!ressources/i18n/fr.json",
    "text!ressources/i18n/de.json",
    "text!ressources/i18n/it.json",
    "text!ressources/i18n/es.json",
    "text!ressources/i18n/ja.json",
    "text!ressources/i18n/cn.json",
], function(yapp) {

    // Define loader for templates
    yapp.Ressources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    // Define loader for i18n
    yapp.Ressources.addNamespace("i18n", {
        loader: "require",
        base: "ressources/i18n",
        extension: ".json"
    });

    yapp.I18n.loadLocale(["en", "fr", "de", "it", "es", "ja", "cn"]);

    return arguments;
});