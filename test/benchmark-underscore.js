define([
    'benchmarks',
    'hr/hr',
    'underscore',
    'jQuery'
], function(benchmarks, hr, _, $) {
    var obj = {
        'a': {
            'a': 1,
            'b': {
                'c': 2
            },
            'c': 1
        },
        'b': {
            'test': 2
        }
    };
    var objE = {
        'a': {
            'a': 4
        },
        'b': {

        }
    };

    benchmarks.add("_.deepClone", function() {
        return _.deepClone(obj);
    });

    benchmarks.add("_.extend", function() {
        return _.deepExtend({}, obj, objE);
    });
})