define([
    'tests',
    'hr/hr',
    'underscore'
], function(tests, hr, _) {

    var Model = hr.Model.extend({
        defaults: {
            test: "hello"
        }
    });

    tests.add("model.defaults", function(test) {
        var m = new Model();
        test.assert(m.get("test") == "hello");
    });

    tests.add("model.set", function(test) {
        var m = new Model();
        m.set("test", "world")
        test.assert(m.get("test") == "world");
    });

    tests.add("model.toJSON()", function(test) {
        var m = new Model();
        test.assert(m.toJSON().test == "hello");
    });

    tests.add("model.event.change", function(test) {
        var m = new Model({});
        m.on("change", function() {
            test.done();
        });
        m.set("test", "world");
    });

    tests.add("model.event.change.valid", function(test) {
        var data = {
            'a': {
                'b': 1
            }
        };
        var m = new hr.Model({}, data);
        m.on("change:a", function() {
            test.fail();
        });
        m.set({
            'a': {
                'b': 1
            }
        });
        test.done();
    });

    tests.add("model.event.change.deep.1", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: 2
            }
        });

        m.on("change:deep.deep2", function() {
            test.done();
        });

        m.set("deep.deep2", 3);
    });

    tests.add("model.event.change.deep.2", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: [1,2]
            }
        });

        m.on("change:deep.deep2", function() {
            test.done();
        });

        m.set("deep.deep2", [1, 2, 3]);
    });

    tests.add("model.event.change.deep.3", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: [1,2]
            }
        });

        m.on("change:deep.deep3", function() {
            test.done();
        });

        m.set("deep.deep3", [1, 2, 3]);
    });
})