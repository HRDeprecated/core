require([
    "hr/hr",
    "hr/args"
], function(hr, args) {
    hr.configure(args, {
        // options for hr
    });

    var Application = hr.Application.extend({
        name: "Test Application",
        template: "main"
    });

    ...
});