define([
    'tests',
    'hr/hr',
    'underscore'
], function(tests, hr, _) {

    tests.add("list.count", function(test) {
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

        test.assert(l.count() == 3);
    });

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

    tests.add("list.filter.event", function(test) {
        var l = new hr.List({
            baseFilter: function(model) {
                return model.get("test") > 2;
            }
        });

        l.on("filter", function(item, state) {
            test.assert(state == false);
        })

        l.collection.add({
            'test': 1
        });
    });

    tests.add("list.filter.change", function(test) {
        var l = new hr.List({
            baseFilter: function(model) {
                return model.get("test") > 2;
            }
        });

        l.collection.add({
            'id': "test",
            'test': 2
        });

        var m = l.collection.get("test");
        m.set("test", 3);

        test.assert(l.count() == 1);
    });

    tests.add("list.filter.count", function(test) {
        var l = new hr.List({
            baseFilter: function(model) {
                return model.get("test") > 2;
            }
        });

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

        test.assert(l.count() == 1);
    });
})