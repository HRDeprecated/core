require([
    "yapp/yapp",
    "yapp/args",

    "views/imports",
    "ressources/imports"
], function(yapp, args) {
    // Configure yapp
    yapp.configure(args);

    // Define base application
    var Application = yapp.Application.extend({
        name: "Hello yapp.js!",
        template: "main.html",
        metas: {
            "description": "My First application with yapp."
        },
        links: {
            "icon": yapp.Urls.static("images/favicon.png")
        },
        routes: {
            "lang/:l": "changeLang",
        },

        changeLang: function(lang) {
            lang = lang || "en";
            yapp.I18n.setCurrentLocale(lang);
            return this.render();
        }
    });

    var app = new Application();
    app.run();
});