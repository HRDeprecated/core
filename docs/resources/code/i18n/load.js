// Configure loading of i18n translations
yapp.Resources.addNamespace("i18n", {
    loader: "http",
    base: "i18n",
    extension: ".json"
});

// Load translations
var dEn = yapp.I18n.loadLocale("en");
var dFr = yapp.I18n.loadLocale("fr");

yapp.Deferred.when(dEn, dFr).then(function() {
    // Set locale to english
    yapp.I18n.setCurrentLocale("en");
    alert("In english : "+yapp.I18n.t("message.hello", {name: "Samy"}));

    // Define locale during the translation
    alert("In french : "+yapp.I18n.t("message.hello", {
        name: "Samy",
        locale: "fr"
    }));  
});