define([
    'benchmarks',
    'hr/hr',
    'jsondiffpatch'
], function(benchmarks, hr, jsondiffpatch) {
    benchmarks.add("model.set", function() {
        var data = {
            'a': {
                'b': 1
            }
        };
        var m = new hr.Model({}, data);
        m.set({
            'a': {
                'b': 1,
                'c': 2
            },
            'b': {
                'r': 1
            }
        });
    });

    benchmarks.add("model.get", function() {
        var data = {
            'a': {
                'b': {
                    c: 3,
                    d: {
                        lol: 1
                    }
                }
            }
        };
        var m = new hr.Model({}, data);
        m.get("a.b", 2);
    });
})