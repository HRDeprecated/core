// Requires
var Q = require('q');
var _ = require('underscore');
var os = require('os');
var fs = require('fs');
var path = require('path');
var wrench = require('wrench');

var utils = require('./utils');

// Constants
var INDEX_HTML_TEMPLATE = [
    '<!DOCTYPE html>',
    '<html>',
    '    <head>',
    '        <meta charset="utf-8">',
    '        <title>%s</title>',
    '        <link rel="stylesheet" href="%s">',
    '        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>',
    '        <script type="text/javascript" src="%s"></script>',
    '    </head>',
    '    <body></body>',
    '</html>'
].join(os.EOL);


function Builder(config, log) {
    this.config = config;
    this.log = log;

    _.bindAll(this);
}

// Build application
Builder.prototype.build = function() {
    this.log.writeln("Start building application "+this.config.name);
    this.log.writeln("Build directory : "+this.config.build);
    this.log.writeln("");

    // Remove old build and create new one
    this.log.writeln("Clean old build");
    wrench.rmdirSyncRecursive(this.config.build, true);
    this.log.writeln("Make build directory");
    wrench.mkdirSyncRecursive(this.config.build, 0777);
    wrench.mkdirSyncRecursive(path.resolve(this.config.build, this.config.staticBase), 0777);


    // Generate
    // Execute these steps in order
    return [
        this.genHTML,
        this.genJS,
        this.genCSS,
        this.genStatic
    ].reduce(Q.when, Q());
};

Builder.prototype.genHTML = function() {
    if (_.isEmpty(this.config.out.html)) {
        return Q(false);
    }

    this.log.writeln("Generating html entry for application");
    if (_.isEmpty(this.config.index)) {
        fs.writeFileSync(path.resolve(this.config.build, this.config.out.html), utils.parse(INDEX_HTML_TEMPLATE, this.config.name, this.config.out.css, this.config.out.js));
    } else {
        fs.writeFileSync(path.resolve(this.config.build, this.config.out.html), this.config.index);
    }
    this.log.writeln("End of generation");
    this.log.writeln("");

    return Q(true);
};

// Generate JS code
Builder.prototype.genJS = function() {
    var that = this;
    if (_.isEmpty(this.config.out.js)) {
        return Q(false);
    }

    this.log.writeln("Generating code for application");

    // Files
    var args_file = path.resolve(this.config.base, "hr-args.js");
    var require_config_file = path.resolve(this.config.base, "require-config.js");

    var cleanup = function() {
        fs.unlinkSync(require_config_file);
        fs.unlinkSync(args_file);
    };

    // Generate arguments module
    fs.writeFileSync(args_file , "define(function() { return "+JSON.stringify(_.extend(this.config.args || {}, {
        "revision": (new Date()).getTime(),
        "baseUrl": this.config.baseUrl
    }))+"; });");

    // Generate application require build config file
    var require_config = this.genRJSConfig();
    fs.writeFileSync(require_config_file, JSON.stringify(require_config));

    // Compile application js code
    var command = utils.parse(this.config.compilers.js, require_config_file);

    return utils.qExec(command)
    .then(function(stdout, stderr) {

        // Do Cleanup
        cleanup();

        that.log.writeln("End of generation");
        that.log.writeln("");

        return true;
    },
    function(err) {
        // Do Cleanup
        cleanup();

        that.log.error(err.stderr);
        that.log.error(err.stdout);
    });
};

// Generate static files
Builder.prototype.genStatic = function() {
    var that = this;

    this.config.static = this.config.static || {};

    this.log.writeln("Generating static files for application");
    _.each(this.config.static, function(directory, output_path) {
        that.log.writeln("  -> Creating "+output_path);
        wrench.copyDirSyncRecursive(directory, path.resolve(that.config.build, that.config.staticBase, output_path), {
            forceDelete: true
        });
    });
    this.log.writeln("End of generation");
    this.log.writeln("");

    return Q(true);
};

// Generate static files
Builder.prototype.genCSS = function() {
    var that = this;
    if (_.isEmpty(this.config.out.css)) {
        return Q(false);
    }

    var input = this.config.style;
    var output = path.resolve(this.config.build, this.config.out.css);

    this.log.writeln("Generating style for application");

    var command = utils.parse(this.config.compilers.css, input, output);
    return utils.qExec(command)
    .then(function(err) {
        that.log.writeln("End of generation");
        that.log.writeln("");

        return true;
    }, function(err) {
        that.log.error(err.stderr);
        that.log.error(err.stdout);
        return false;
    });
};



// Generate require.js config file for build js code
Builder.prototype.genRJSConfig = function() {
    var config = this.config;

    // Our internal vendors path
    var vendors_path = path.resolve(__dirname, "../vendors");
    var src_path = path.resolve(__dirname, "../src");

    return _.extend({
        baseUrl: "./",
        name: config.main,
        out: path.resolve(config.build, config.out.js),
        paths: _.extend(config.paths || {}, {
            "requireLib":       path.resolve(vendors_path, "require"),
            "text":             path.resolve(vendors_path, "require-text"),
            'underscore':       path.resolve(vendors_path, "lodash"),
            "jQuery":           path.resolve(vendors_path, "jquery"),
            'jsondiffpatch':    path.resolve(vendors_path, "jsondiffpatch"),
            "q":                path.resolve(vendors_path, "q"),
            "hr":               path.resolve(src_path),
            "hr/args":          path.resolve(config.base,  "hr-args")
        }),
        shim: _.extend(config.shim || {}, {
            'underscore': {
                exports: '_'
            },
            'jQuery': {
                exports: '$'
            },
            'q': {
                exports: 'Q'
            },
            'jsondiffpatch': {
                exports: 'jsondiffpatch'
            }
        }),
        preserveLicenseComments: false,
        include: [config.main, "requireLib"],
        optimize: config.debug === false ? "uglify" : "none"
    }, config.options || {});
};



exports.Builder = Builder;