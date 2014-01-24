define([
    'tests',
    'hr/hr',
    'underscore'
], function(tests, hr, _) {

    tests.add("list.filter", function(test) {
        var l = new hr.List();

        l.collection.reset([
            {
                'test': 1
            },
            {
                'test': 2
            },
            {
                'test': 3
            }
        ]);

        test.assert(l.filter(function(model) {
            return model.get("test") > 2;
        }) == 1);
    });
})