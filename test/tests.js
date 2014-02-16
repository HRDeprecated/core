define([
    'q',
    'underscore',
    'hr/hr'
], function(Q, _, hr) {
    var tests = [];
    var logger = hr.Logger.addNamespace("tests");

    var addTest = function(name, func) {
        var startTime, endTime, _ended;
        var d = Q.defer();

        var test =  {
            done: function() {
                if (_ended) return;
                _ended = true;
                endTime = Date.now();

                logger.log(name+": succeed in "+((endTime-startTime)/1000)+" seconds");

                d.resolve()
            },
            fail: function(err) {
                if (_ended) return;
                _ended = true;
                
                logger.error(name+": failed", err);
                d.reject()
            },
            assert: function(value, realvalue) {
                if (realvalue == undefined) realvalue = true;
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
                logger.log(name+": start");

                // Call the test
                startTime = Date.now();
                Q().then(function() {
                    return func(test);
                }) 
                .then(function() {
                    test.done();
                }, function(err) {
                    test.fail(err);
                });

                return d.promise;
            }
        });
    };

    var runTests = function() {
        var total = _.size(tests);
        var n = 0;

        logger.log("");
        logger.log("Start", total, "tests")
        return _.reduce(tests, function(prev, test) {
            return prev.then(function() {
                n = n +1;
                return test.run().timeout(5*1000);
            });
        }, Q()).then(function() {
            logger.log("");
            logger.log("Tests succeed: "+n+"/"+total);
        }, function() {
            logger.error("");
            logger.error("Tests failed: "+n+"/"+total);
            return Q.reject(new Error("Tests failed"));
        });
    };

    return {
        'add': addTest,
        'run': runTests
    }
})