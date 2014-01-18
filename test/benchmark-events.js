define([
    'benchmarks',
    'hr/hr',
    'underscore',
    'jQuery'
], function(benchmarks, hr, _, $) {
    
    var o = new hr.Class();

    o.on("test:test2", function() {

    });

    o.on("test", function() {
        
    });

    benchmarks.add("event.trigger", function() {
        return o.trigger("test:test2");
    });
})