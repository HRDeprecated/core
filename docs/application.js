require([
    "underscore",
    "hr/hr",
    "hr/args",

    "views/views",
    "resources/resources"
], function(_, hr, args) {
    // Configure hr
    hr.configure(args);

    // Define base application
    var Application = hr.Application.extend({
        name: "hr.js",
        template: "main.html",
        metas: {
            "description": "Build large client-side application in a structured way.",
            "author": "Samy Pessé"
        },
        links: {
            "icon": hr.Urls.static("images/favicon.png")
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

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            var throttled = _.bind(_.throttle(function() {
                if ($(window).scrollTop() > this.components.lateralbar.$("#lateralbar").height()) {
                    this.components.lateralbar.$("#lateralbar").addClass("close");
                } else {
                    this.components.lateralbar.$("#lateralbar").removeClass("close");
                }
            }, 250), this);
            $(window).scroll(throttled);
            return this;
        },

        search: function(e) {
            var self = this;
            if (_.isString(e)) {
                this.$(".search input").val(e);
            } else {
                e.preventDefault();
            }

            var query = this.$(".search input").val().toLowerCase();

            this.$("#lateralbar .menu").each(function() {
                var n = 0;
                $(this).removeClass("search-result");
                $(this).removeClass("no-search-result");

                $(this).find("li").each(function() {
                    $(this).removeClass("search-result");
                    $(this).removeClass("no-search-result");
                    if (query.length > 0) {
                        if ($(this).text().toLowerCase().indexOf(query) !== -1) {
                            n = n + 1;
                            $(this).addClass("search-result");
                        } else {
                            $(this).addClass("no-search-result");
                        } 
                    }
                });
                if (query.length > 0) {
                    if ($(this).find("h3").text().toLowerCase().indexOf(query) !== -1) {
                        n = 1;
                        $(this).find("li").removeClass("no-search-result").addClass("search-result");
                    }

                    if (n > 0) {
                        $(this).addClass("search-result");
                    } else {
                        $(this).addClass("no-search-result");
                    }
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
    });

    var app = new Application();
    app.run();
});