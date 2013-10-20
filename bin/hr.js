#!/usr/bin/env node

// Requries
var _ = require('underscore');
var path = require('path');
var _cli = require('commander');

var createApp = require('../').app.createApp;

var pkg = require('../package.json');
var wrench = require('wrench');

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
    .command('new')
    .description('create a new application.')
    .action(function() {
        if (this.dir == null) {
            console.log("Define application directory using option 'dir' (ex: hr.js new -d my_app)");
            return;
        }
        var defaultApp = path.resolve(__dirname, "../lib/defaults/app");
        console.log("Create new application in "+this.dir);
        wrench.copyDirSyncRecursive(defaultApp, this.dir, {
            forceDelete: true
        });
    });

    _cli
    .command('build')
    .description('build application code.')
    .action(appCall('build'));

    _cli
    .command('run')
    .description('run simple http server for application.')
    .action(appCall('run'));

    _cli
    .command('dev')
    .description('Watches your sources and rebuilds on changes. Useful for interactive development.')
    .action(appCall('dev'));

    _cli
    .option('-d, --dir <path>', 'App directory if different from current working directory.');

    _cli
    .version(pkg.version)
    .parse(process.argv);

    if (!_cli.args.length) _cli.help();
}


// Run main function
main();