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

// Copy file in sync
function copyFile(path, distPath) {
    fs.writeFileSync(distPath, fs.readFileSync(path));
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
exports.parse = parse;
exports.qExec = qExec;
exports.copyFile = copyFile;
