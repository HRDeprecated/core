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
})