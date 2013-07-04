// Configure templates to use http loader
yapp.Ressources.addNamespace("templates", {
    loader: "http",
    base: "templates"
});

// Configure i18n to use internal content for languages
yapp.Ressources.addNamespace("i18n", {
    loader: "require",
    base: "ressources/i18n",
    mode: "text"
});

// Add a other namespace for your application
yapp.Ressources.addNamespace("codes", {
    loader: "require",
    base: "ressources/code",
    mode: "text"
});

yapp.Ressources.load("codes", "urls/base.js").then(function(code) {
    alert("Code loaded : "+code);
}, function() {
    alert("error when loading code !");
})