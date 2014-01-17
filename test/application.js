require([
    "underscore",
    "hr/hr",
    "hr/args",
    "tests",
    
    "test-storage",
    "test-model"
], function(_, hr, args, tests) {
    // Configure hr
    hr.configure(args);

    // Define base application
    var Application = hr.Application.extend({
        name: "hr.js tests"
    });

    var app = new Application();
    app.run();

    tests.run();
});