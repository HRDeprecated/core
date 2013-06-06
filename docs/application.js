require([
    "yapp/yapp",
    "yapp/args",

    "views/views",
    "ressources/ressources"
], function(yapp, args) {
    // Configure yapp
    yapp.configure(args);

    // Define base application
    var app = new (yapp.Application.extend({
        name: "Yapp.js Documentation",
        template: "main.html",
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