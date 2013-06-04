define([
    "Underscore",
    "yapp/configs",
    "yapp/core/view",
], function(_, configs, View, Logger) {
    /*
     *  This view is a simple component for importing template
     *  in a template.
     *  <%= view.component("template", {name: "mytemplate", args: {}}) %>
     */
    var TemplateView = View.extend({
        template: function() {
            return this.options.template;
        },

        templateContext: function() {
            return this.options.args;
        },
    });

    /* Register template component */
    View.Template.registerComponent("template", TemplateView);

    return TemplateView;
});