var fs = require("fs");
var system = require('system');
var page = require('webpage').create();

var args = system.args;
var doBenchmarks = args[1] == "--benchmarks";
var url = fs.workingDirectory+'/test/build/index.html?'+(doBenchmarks? "benchmarks=true" : "");


page.onConsoleMessage = function(msg, lineNum, sourceId, lol) {
    console.log(msg);
};

console.log("Start test on", url);

page.open(url, function (status) {
    setInterval(function() {
        var finished = page.evaluate(function() {
            return window.testsFinished;
        });
        var error = page.evaluate(function() {
            return window.testsError;
        });

        if (finished) {
            phantom.exit(error? 1 : 0);
        }
    }, 1000);
});