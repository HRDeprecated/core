define([
    'q',
    'underscore',
    'hr/hr'
], function(Q, _, hr) {
    var benchmarks = [];
    var logger = hr.Logger.addNamespace("benchmarks");

    var runBenchmarks = function() {
        var total = _.size(benchmarks);
        var n = 0;

        logger.log("");
        logger.log("Start", total, "benchmarks")
        return _.reduce(benchmarks, function(prev, benchmark) {
            return prev.then(function() {
                n = n +1;
                return benchmark.run().timeout(5*1000);
            });
        }, Q()).then(function() {
            logger.log("");
            logger.log("Benchmarks finished: "+n+"/"+total);
        }, function() {
            logger.error("");
            logger.error("Benchmarks failed: "+n+"/"+total);
        });
    };

    var addBenchmark = function(name, f, n) {
        n = n || 100000;
        benchmarks.push({
            'name': name,
            'run': function() {
                var s = Date.now();

                for (var i=0;i<n;i++) f();
                
                var e = Date.now();
                
                logger.log(name+": took "+((e-s)/1000)+" seconds for "+n+" operations");

                return Q();
            }
        })
    }

    return {
        'run': runBenchmarks,
        'add': addBenchmark
    }
})