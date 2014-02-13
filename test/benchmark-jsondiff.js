define([
    'benchmarks',
    'hr/hr',
    'jsondiffpatch'
], function(benchmarks, hr, jsondiffpatch) {
    benchmarks.add("json.diff", function() {
        var o1 = {
            a: 1,
            b: {
                a: 1,
                b: 2
            },
            c: "test"
        };

        var o2 = {
            a: 1,
            b: {
                a: 2,
                b: 1
            },
            c: "testlol"
        };

        jsondiffpatch.diff(o1, o2);
    });

    benchmarks.add("json.apply", function() {
        var o1 = {
            a: 1,
            b: {
                a: 1,
                b: 2
            },
            c: "test"
        };

        var o2 = {
            a: 1,
            b: {
                a: 2,
                b: 1
            },
            c: "testlol"
        };

        var diff = jsondiffpatch.diff(o1, o2);
        jsondiffpatch.patch(o1, diff);
    });
})