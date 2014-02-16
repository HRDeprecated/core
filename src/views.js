define([
    "hr/utils",
    "hr/view",
    "hr/template"
], function(_, View, Template) {
    
    var RelativeDateView = View.extend({
        tagName: "span",
        className: "component-relativedate",
        defaults: {
            time: 0,
            update: 1000*60,
            updateD: 1.01,
            className: ""
        },

        initialize: function(options) {
            RelativeDateView.__super__.initialize.apply(this, arguments);
            this.$el.addClass(this.options.className);
            return this;
        },

        render: function() {
            if (this.interval != null) clearInterval(this.interval);
            this.interval = setInterval(_.bind(this.render, this), this.options.update); 
            this.options.update = this.options.update*this.options.updateD;
            this.$el.html(Template.utils.timeago(this.options.time));
            return this.ready();
        },
    });
    Template.registerComponent("hr.date.relative", RelativeDateView);

    return {
        "RelativeDate": RelativeDateView
    };
});