define([
    'tests',
    'hr/hr',
    'hr/utils'
], function(tests, hr, _) {

    tests.add("_.deepExtend", function(test) {
        var b = _.deepExtend({}, {
            a: 1,
            b: 2,
            c: {
                d: 3,
                e: 4
            }
        }, {
            c: {
                d: "test",
                f: 5
            }
        });

        test.assert(b.c.d == "test" && b.c.f == 5
            && b.a == 1 && b.b == 2);
    });
})