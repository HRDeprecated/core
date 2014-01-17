define([
    'tests',
    'hr/hr'
], function(tests, hr) {

    var Model = hr.Model.extend({
        defaults: {
            test: "hello"
        }
    });

    tests.add("model.defaults", function(test) {
        var m = new Model();
        test.assert(m.get("test"), "hello");
    });

    tests.add("model.set", function(test) {
        var m = new Model();
        m.set("test", "world")
        test.assert(m.get("test"), "world");
    });

    tests.add("model.toJSON()", function(test) {
        var m = new Model();
        test.assert(m.toJSON().test, "hello");
    });

    tests.add("model.event.change", function(test) {
        var m = new Model();
        m.on("change", function() {
            test.done();
        });
        m.set("test", "world");
    });

    tests.add("model.event.change.deep", function(test) {
        var m = new Model();

        m.set({
            deep: {
                deep2: 2
            }
        });

        m.on("change:deep", function() {
            test.done();
        });

        m.set("deep.deep2", 3);
    });

})