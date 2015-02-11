define([
    'tests',
    'hr/hr',
    'hr/promise',
], function(tests, hr, Q) {
    var worker = new hr.TaskWorker({ script: "static/worker.js" });


    tests.add("worker.callMethod.sync", function() {
        return worker.callMethod("testSync", 2, 3)
        .then(function(r) {
            if (r != 5) throw "Invalid return";
        });
    });

    tests.add("worker.callMethod.async", function() {
        return worker.callMethod("testAsync", 2, 3)
        .then(function(r) {
            if (r != 5) throw "Invalid return";
        });
    });

    tests.add("worker.method", function() {
        var testSync = worker.method("testSync");

        return testSync(2, 3)
        .then(function(r) {
            if (r != 5) throw "Invalid return";
        });
    });

    tests.add("worker.error", function() {
        return worker.callMethod("testError")
        .then(function() {
            throw "Invalid return";
        }, function(err) {
            if (err.message != "test") throw "Invalid error returned";
            return Q();
        });
    });
});