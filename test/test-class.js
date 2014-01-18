define([
    'tests',
    'hr/hr',
    'underscore'
], function(tests, hr, _) {

    tests.add("class.events.trigger", function(test) {
        var o = new hr.Class();

        o.on("test", function() {
            test.done();
        });

        o.trigger("test:test2");
    });

    tests.add("class.events.trigger2", function(test) {
        var o = new hr.Class();

        o.on("test:test2", function() {
            test.done();
        });

        o.trigger("test:test2");
    });
})