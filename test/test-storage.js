define([
    'tests',
    'hr/hr'
], function(tests, hr) {

    tests.add("storage.set", function(test) {
        hr.Storage.set("hello", "world");
        test.assert(hr.Storage.get("hello") == "world");
    });

    tests.add("storage.remove", function(test) {
        hr.Storage.remove("hello");
        test.assert(hr.Storage.get("hello") == null);
    });

})