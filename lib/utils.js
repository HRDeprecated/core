// Requires
var Q = require('q');
var _ = require('underscore');

var fs = require('fs');

var clc = require('cli-color');

var exec = require('child_process').exec;


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

// Execute with promises
function qExec(command, options) {
    var d = Q.defer();

    exec(command, options, function(err, stdout, stderr) {
        if(err) {
            err.stdout = stdout;
            err.stderr = stderr;
            return d.reject(err);
        }
        return d.resolve(stdout, stderr);
    });

    return d.promise;
}

// Exports
exports.log = log;
exports.logAs = logAs;
exports.parse = parse;
exports.qExec = qExec;
exports.copyFile = copyFile;
exports.classCreator = classCreator;
