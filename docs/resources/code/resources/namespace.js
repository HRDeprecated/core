// Configure templates to use http loader
yapp.Resources.addNamespace("templates", {
    loader: "http",
    base: "templates"
});

// Configure i18n to use internal content for languages
yapp.Resources.addNamespace("i18n", {
    loader: "require",
    base: "resources/i18n",
    mode: "text"
});

// Add a other namespace for your application
yapp.Resources.addNamespace("codes", {
    loader: "require",
    base: "resources/code",
    mode: "text"
});

yapp.Resources.load("codes", "urls/base.js").then(function(code) {
    alert("Code loaded : "+code);
}, function() {
    alert("error when loading code !");
})