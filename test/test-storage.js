define([
    'tests',
    'hr/hr'
], function(tests, hr) {
    var s = new hr.Storage({
        key: "test"
    });

    tests.add("storage.set", function(test) {
        hr.Storage.set("hello", "world");
        test.assert(hr.Storage.get("hello") == "world");
    });

    tests.add("storage.remove", function(test) {
        hr.Storage.remove("hello");
        test.assert(hr.Storage.get("hello") == null);
    });

    tests.add("storage.instance.set", function(test) {
        s.set("hello", "world");
        test.assert(s.get("hello") == "world");
    });

    tests.add("storage.instance.remove", function(test) {
        s.remove("hello");
        test.assert(s.get("hello") == null);
    });
});