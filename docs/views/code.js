require([
    "yapp/yapp",
    "highlight"
], function(yapp, hljs) {
    /*
     *  This view is a simple component for displaying a code viewer
     *  <%= view.component("code", {code: "test.js"}) %>
     */
    var CodeView = yapp.View.extend({
        tagName: "pre",
        className: "component-codeviewer",
        events: {
            "click .run": "run"
        },
        defaults: {
            run: false
        },

        initialize: function() {
            CodeView.__super__.initialize.apply(this, arguments);
            return this;
        },
        render: function() {
            yapp.Ressources.load("codes", this.options.code).always(_.bind(function(content) {
                this.code = content;
                this.$el.html(hljs.highlightAuto(this.code).value);
                if (this.options.run) {
                    this.$el.append($("<div>", {
                        "class": "run",
                        "text": "Run"
                    }));
                }
                this.ready();
            }, this));
            
            return this.ready();
        },
        run: function() {
            eval(this.code);
        }
    });

    /* Register template component */
    yapp.View.Template.registerComponent("code", CodeView);
    return CodeView;
});