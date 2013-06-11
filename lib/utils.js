// Requires
var _ = require('underscore');

var fs = require('fs');

var clc = require('cli-color');


// Parse string
function parse(str) {
    var args = [].slice.call(arguments, 1);
    var i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

// Log output
function log(step, message, type) {
    var color = (type != "error" ? clc.blue.bold : clc.red.bold);
    console.error(color("["+step+"] ") + message);
}

// Create a logger for a specific step
function logAs(step) {
    return _.partial(log, step);
}

// Copy file in sync
function copyFile(path, distPath) {
    fs.writeFileSync(distPath, fs.readFileSync(path));
}

// A utility function
// used to create a "creator function" for a class
// it simply proxies the class' creation
// would be nice to have this externalized (maybe in underscore)
function classCreator(cls) {
    return function() {
        var args = Array.prototype.slice.apply(arguments);
        var bindArgs = [null].concat(args);
        var constructor = cls.bind.apply(cls, bindArgs);
        return new constructor();
    };
}

// Exports
exports.log = log;
exports.logAs = logAs;
exports.parse = parse;
exports.copyFile = copyFile;
exports.classCreator = classCreator;
