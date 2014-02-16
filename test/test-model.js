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

    tests.add("model.set.deep.modification", function(test) {
        var m = new Model({}, {
            a: {
                b: 1
            }
        });

        var a = m.get("a");
        a.b = 2;

        m.on("change:a.b", function() {
            test.assert(m.get("a.b") == 2);
        });

        m.set("a", a);
        test.fail();
    });

    tests.add("model.set", function(test) {
        var m = new Model();
        m.set("test", "world")
        test.assert(m.get("test") == "world");
    });

    tests.add("model.del", function(test) {
        var m = new Model();
        m.set("test2", "world")
        m.del("test2")
        test.assert(m.get("test2") == null);
    });

    tests.add("model.del.deep", function(test) {
        var m = new Model();
        m.set({
            test2: {
                test3: 1
            }
        })
        m.del("test2.test3")
        test.assert(m.get("test2") != null && m.get("test2.test3") == null);
    });

    tests.add("model.set.deep", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: [1,2]
            }
        });

        m.set("deep.deep2", [1, 2, 3]);
        test.assert(m.get("deep.deep2").length == 3 && m.get("test") == "hello");
    });

    tests.add("model.set.deep.2", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: "hello"
            }
        });

        m.set("deep.deep2", {
            hello: "world"
        });

        test.assert(m.get("deep.deep2.hello") == "world");
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
        test.fail();
    });

    tests.add("model.event.change.2", function(test) {
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

    tests.add("model.event.set", function(test) {
        var data = {
            'a': {
                'b': 1
            }
        };
        var m = new hr.Model({}, data);
        m.on("set", function() {
            test.fail();
        });
        m.set({
            'a': {
                'b': 1
            }
        });
        test.done();
    });

    tests.add("model.event.change.next", function(test) {
        var m = new Model({}, {
            'test': "b"
        });

        m.set("test", "a");
        m.on("set", function() {
            test.done();
        });
        m.set("test", "b");
        test.fail();
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
        test.fail();
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
        test.fail();
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
        test.fail();
    });
})