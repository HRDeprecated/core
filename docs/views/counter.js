define([
    "hr/hr"
], function(hr) {
    /*
     *  This view is a simple component for importing template
     *  in a template.
     *  <%= view.component("counter", {from: }) %>
     */
    var CounterView = hr.View.extend({
        tagName: "div",
        className: "component-counter",
        template: "views/counter.html",

        initialize: function() {
            var self = this;
            CounterView.__super__.initialize.apply(this, arguments);
            setInterval(function() {
                self.render();
            }, 1000);
            return this;
        },
        templateContext: function() {
            var today = new Date();
            var distance = today - this.options.from;
            var one_sec=1000;
            var one_min=one_sec*60;
            var one_hour = one_min*60;
            var one_day=one_hour*24;

            var days = Math.floor(distance/one_day);
            distance = distance-days*one_day;
            var hours = Math.floor(distance/one_hour);
            distance = distance-hours*one_hour;
            var mins = Math.floor(distance/one_min);
            distance = distance-mins*one_min;
            var secs = Math.floor(distance/one_sec);
            distance = distance-secs*one_sec;

            return {
                "prefix": this.options.prefix || "",
                "suffix": this.options.suffix || "",
                "days": days,
                "hours": hours,
                "mins": mins,
                "secs": secs
            };
        }
    });

    /* Register template component */
    hr.View.Template.registerComponent("counter", CounterView);
    return CounterView;
});