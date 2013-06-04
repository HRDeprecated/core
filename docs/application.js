require([
    "yapp/yapp",
    "yapp/args",

    "views/counter",
    "views/code",

    "text!code/build/structure.txt",
    "text!code/build/build.js",
    "text!code/build/options.js",
    "text!code/build/module.js",
    "text!code/application/extend.js",
    "text!code/application/run.js",
    "text!code/view/extend.js",
    "text!code/view/template.js",
    "text!code/view/template_function.js",
    "text!code/template/syntax.html",
    "text!code/template/components.html",
    "text!code/template/components.js",
    "text!code/class/extend.js",
    "text!code/class/initialize.js",
    "text!code/class/defaults.js",
    "text!code/class/on.js",
    "text!code/class/on_all.js",
    "text!code/class/on_map.js",
    "text!code/class/on_sub.js",
    "text!code/class/off.js",
    "text!code/urls/base.js",
    "text!code/urls/static.js",
    "text!code/urls/route.js",
    "text!code/urls/template.html",
    "text!code/cache/key.js",
    "text!code/cache/namespace.js",
], function(yapp, args) {

    // Configure yapp
    yapp.configure(args, {
        "baseUrl": "/yapp.js/",
        "templates": {
            "loader": "yapp/templates/loaders/http"
        }
    });

    // Define base application
    var app = new (yapp.Application.extend({
        name: "Yapp.js Documentation",
        template: "main",
        metas: {
            "description": "Build large client-side application in a structured way.",
            "author": "Samy Pessé"
        },
        links: {
            "icon": yapp.Urls.static("images/favicon.png")
        },
        events: {
            "submit .search": "search",
            "keyup .search input": "search",
        },
        routes: {
            "*actions": "move",
            "": "index",
            "search/:q": "search",
        },

        search: function(e) {
            var self = this;
            if (_.isString(e)) {
                this.$(".search input").val(e);
            } else {
                e.preventDefault();
            }

            var query = this.$(".search input").val().toLowerCase();

            this.$("header .menu").each(function() {
                var n = 0;
                $(this).find("li").each(function() {
                    if ($(this).text().toLowerCase().indexOf(query) !== -1) {
                        n = n + 1;
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
                if ($(this).find("h3").text().toLowerCase().indexOf(query) !== -1) {
                    n = 1;
                    $(this).find("li").show();
                }

                if (n > 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        },

        
        index: function() {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            this.search("");
        },

        move: function(section) {
            $('html, body').animate({
                scrollTop: this.$("*[id='"+section+"']").offset().top
            }, 1000);
        }
    }));

    app.run();
});