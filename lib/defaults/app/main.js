require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "views/views",
    "resources/resources"
], function(_, yapp, args) {
    // Configure yapp
    yapp.configure(args);

    // Define base application
    var Application = yapp.Application.extend({
        name: "Hello",
        template: "main.html",
        metas: {
            "description": "Base application using yapp.js."
        },
        links: {
            "icon": yapp.Urls.static("images/favicon.png")
        },
        events: {}
    });

    var app = new Application();
    app.run();
});