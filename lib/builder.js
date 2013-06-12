// Requires
var _ = require('underscore');

var os = require('os');
var fs = require('fs');
var path = require('path');

var wrench = require('wrench');
var exec = require('execSync').exec;

var utils = require('./utils');

// create loggers
var log = {
    js: utils.logAs('js'),
    html: utils.logAs('html'),
    build: utils.logAs('build'),
    'static': utils.logAs('static'),
    css: utils.logAs('stylesheet')
};

// Constants
var INDEX_HTML_TEMPLATE = [
    '<!DOCTYPE html>',
    '<html>',
    '    <head>',
    '        <meta charset="utf-8">',
    '        <title>%s</title>',
    '        <link rel="stylesheet" href="%s">',
    '        <script type="text/javascript" src="%s"></script>',
    '    </head>',
    '    <body></body>',
    '</html>'
].join(os.EOL);


function Builder(config) {
    this.config = config;

    _.bindAll(this);
}

// Build application
Builder.prototype.build = function() {
    log.build("Start building application "+this.config.name);
    log.build("Build directory : "+this.config.build);
    log.build("");

    // Remove old build and create new one
    wrench.rmdirSyncRecursive(this.config.build, true);
    wrench.mkdirSyncRecursive(this.config.build, 0777);
    wrench.mkdirSyncRecursive(path.resolve(this.config.build, this.config.staticBase), 0777);


    // Generate
    this.genHTML();
    this.genJS();
    this.genCSS();
    this.genStatic();
};

Builder.prototype.genHTML = function() {
    if (_.isEmpty(this.config.out.html) == false) {
        log.html("Generating code for application");
        if (_.isEmpty(this.config.index)) {
            fs.writeFileSync(path.resolve(this.config.build, this.config.out.html), utils.parse(INDEX_HTML_TEMPLATE, this.config.name, this.config.out.css, this.config.out.js));
        } else {
            utils.copyFile(this.config.index, path.resolve(this.config.build, this.config.out.html));
        }
        log.html("End of generation");
        log.html("");
    }
};

// Generate JS code
Builder.prototype.genJS = function() {
    if (_.isEmpty(this.config.out.js) == false) {
        log.js("Generating code for application");

        // Files
        var args_file = path.resolve(this.config.base, "yapp-args.js");
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
        var result = exec(utils.parse(this.config.compilers.js, require_config_file));

        // Do Cleanup
        cleanup();

        if (result.code !== 0) {
            log.js(result.stdout, "error");
            return false;
        }
        log.js("End of generation");
        log.js("");
    }
    return true;
};

// Generate static files
Builder.prototype.genStatic = function() {
    var that = this;

    this.config.static = this.config.static || {};

    log.static("Generating static files for application");
    _.each(this.config.static, function(directory, output_path) {
        log.static("  -> Creating "+output_path);
        wrench.copyDirSyncRecursive(directory, path.resolve(that.config.build, that.config.staticBase, output_path), {
            forceDelete: true
        });
    });
    log.static("End of generation");
    log.static("");
};

// Generate static files
Builder.prototype.genCSS = function() {
    if (_.isEmpty(this.config.out.css) == false) {
        var input = this.config.style;
        var output = path.resolve(this.config.build, this.config.out.css);

        log.css("Generating style for application");

        var result = exec(utils.parse(this.config.compilers.css, input, output));
        if(result.code) {
            log.css(result.stdout, "error");
            return false;
        }
        log.css("End of generation");
        log.css("");
    }
    return true;
};



// Generate require.js config file for build js code
Builder.prototype.genRJSConfig = function() {
    var config = this.config;

    // Our internal vendors path
    var vendors_path = path.resolve(__dirname, "../vendors");

    return {
        baseUrl: "./",
        name: config.main,
        out: path.resolve(config.build, config.out.js),
        paths: _.extend(config.paths || {}, {
            "requireLib":   path.resolve(vendors_path, "require"),
            "text":         path.resolve(vendors_path, "require-text"),
            "Underscore":   path.resolve(vendors_path, "underscore"),
            "jQuery":       path.resolve(vendors_path, "jquery"),
            "yapp/yapp":    path.resolve(vendors_path, "yapp"),
            "yapp/args":    path.resolve(config.base, "yapp-args")
        }),
        shim: _.extend(config.shim || {}, {
            'Underscore': {
                exports: '_'
            },
            'jQuery': {
                exports: '$'
            }
        }),
        preserveLicenseComments: false,
        include: [config.main, "requireLib"],
        optimize: config.debug === false ? "uglify" : "none"
    };
};



exports.Builder = Builder;
exports.createBuilder = utils.classCreator(Builder);