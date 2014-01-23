define([
    'tests',
    'hr/hr',
    'underscore'
], function(tests, hr, _) {


    tests.add("collection.add.unique", function(test) {
        var c = new hr.Collection();

        var m = {
            'id': 'test_unique_id'
        };

        c.add(m);
        c.add(m);

        test.assert(c.size() == 1);
    });
})