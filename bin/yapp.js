#!/usr/bin/env node

// Requries
var _cli = require('commander');

var createApp = require('../').app.createApp;

var pkg = require('../package.json');

// Create a function
// That creates the app then calls the given method
function appCall(methodName) {
    return function() {
        var app = createApp(this.dir);
        app[methodName]();
    };
}

function main() {
    _cli
    .command('all')
    .description('build application code and run it.')
    .action(appCall('all'));

    _cli
    .command('build')
    .description('build application code.')
    .action(appCall('build'));

    _cli
    .command('run')
    .description('run simple http server for application.')
    .action(appCall('run'));

    _cli
    .option('-d, --dir <path>', 'App directory if different from current working directory.');


    _cli
    .version(pkg.version)
    .parse(process.argv);
}


// Run main function
main();