define([
    'tests',
    'hr/hr'
], function(tests, hr) {
    var worker = new hr.TaskWorker({ worker: "static/worker.js" });


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

});