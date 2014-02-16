define([
    'benchmarks',
    'hr/hr',
    'hr/utils',
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

    benchmarks.add("_.cloneDeep", function() {
        return _.cloneDeep(obj);
    });

    benchmarks.add("_.deepExtend", function() {
        return _.deepExtend({}, obj, objE);
    });

    benchmarks.add("_.deepExtend.1", function() {
        var obj2 = {
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
        var obj3 = {
            'a': {
                'a': 4
            },
            'b': {

            }
        };
        return _.deepExtend({}, obj2, obj3);
    });

    benchmarks.add("_.deepExtend.2", function() {
        var obj2 = {
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
        var obj3 = {
            'a': {
                'a': 4
            },
            'b': {

            }
        };
        return _.deepExtend(obj2, obj3);
    });
})