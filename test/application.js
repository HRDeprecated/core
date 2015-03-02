require([
    "hr/utils",
    "hr/hr",
    "hr/args",
    "tests",
    "benchmarks",

    "benchmark-events",
    "benchmark-utils",
    "benchmark-jsondiff",
    "benchmark-model",

    "test-utils",
    "test-class",
    "test-storage",
    "test-model",
    "test-collection",
    "test-list",
    "test-worker"
], function(_, hr, args, tests, benchmarks) {
    // Configure hr
    hr.configure(args);

    // Define base application
    var Application = hr.Application.extend({
        name: "hr.js tests"
    });

    var app = new Application();
    app.run();

    var p;

    if (!app.getQuery("benchmarks")) {
        p = tests.run();
    } else {
        p = benchmarks.run();
    }

    p
    .fail(function(err) {
        window.testsError = err;
    })
    .then(function() {
        console.log("");
        console.log("Done!");
        window.testsFinished = true;
    });
});