require([
    "yapp/yapp",
    "yapp/args"
], function(yapp, args) {
    yapp.configure(args, {
        // options for yapp
    });

    var Application = yapp.Application.extend({
        name: "Test Application",
        template: "main"
    });

    ...
});