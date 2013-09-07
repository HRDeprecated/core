// Configure loading of i18n translations
hr.Resources.addNamespace("i18n", {
    loader: "http",
    base: "i18n",
    extension: ".json"
});

// Load translations
var dEn = hr.I18n.loadLocale("en");
var dFr = hr.I18n.loadLocale("fr");

hr.Deferred.when(dEn, dFr).then(function() {
    // Set locale to english
    hr.I18n.setCurrentLocale("en");
    alert("In english : "+hr.I18n.t("message.hello", {name: "Samy"}));

    // Define locale during the translation
    alert("In french : "+hr.I18n.t("message.hello", {
        name: "Samy",
        locale: "fr"
    }));  
});