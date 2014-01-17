define([
    'q',
    'underscore',
    'hr/hr'
], function(Q, _, hr) {
    var tests = [];
    var logger = hr.Logger.addNamespace("test");

    var addTest = function(name, func) {
        var d = Q.defer();
        var test =  {
            done: function() {
                logger.log(name+": succeed");
                d.resolve()
            },
            fail: function(err) {
                logger.error(name+": failed", err);
                d.reject()
            },
            assert: function(value, realvalue) {
                if (value != realvalue) {
                    test.fail(new Error("Error asserting: "+value+"!="+realvalue));
                } else {
                    test.done();
                }
            }
        };

        tests.push({
            'name': name,
            'run': function() {
                logger.log("");
                logger.log(name+": start test");
                var ret = func(test);
                if (Q.isPromise(ret)) {
                    ret.then(function() {
                        test.done();
                    }, function(err) {
                        test.fail(err);
                    })
                }

                return d.promise;
            }
        });
    };

    var runTests = function() {
        var total = _.size(tests);
        var n = 0;

        logger.log("Start", total, "tests")
        return _.reduce(tests, function(prev, test) {
            return prev.then(function() {
                n = n +1;
                return test.run();
            });
        }, Q()).then(function() {
            logger.log("");
            logger.log("Tests succeed: "+n+"/"+total);
        }, function() {
            logger.error("");
            logger.error("Tests failed: "+n+"/"+total);
        });
    }

    return {
        'add': addTest,
        'run': runTests
    }
})