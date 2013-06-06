var _ = require('Underscore');
var express = require('express');
var wrench = require('wrench');
var http = require('http');
var path = require('path');
var fs = require('fs');
var exec = require('execSync').exec;
var _cli = require('commander');
var clc = require('cli-color');


var index_html_template = '<!DOCTYPE html> \
<html> \
    <head> \
        <meta charset="utf-8"> \
        <title>%s</title> \
        <link rel="stylesheet" href="%s"> \
        <script type="text/javascript" src="%s"></script> \
    </head> \
    <body></body> \
</html>';


// Parse string
function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

// Log output
var log = function(step, message, type) {
    var color = type != "error" ? clc.blue.bold : clc.red.bold;
    console.log(color("["+step+"] ") + message);
};

// Copy file in sync
var copy_file = function(path, distPath) {
    fs.writeFileSync(distPath, fs.readFileSync(path));
};


module.exports = {
    Application: function(configs) {
        _.defaults(configs, {
            // Base directory for the application
            "base": null,

            // Base url for the application
            "baseUrl": "",

            // Application name
            "name": "untitled",

            // Mode debug
            // if debug is false then files are compressed for optimization
            "debug": true,

            // Main entry file for application
            "main": null,

            // Build directory for output
            // directory is created if inexistant
            "build": null,

            // Output files
            "out": {
                "js":   "static/application.js",
                "css":  "static/application.css",
                "html": "index.html"
            },

            // Static files
            // Map of {"directory": "absolute/path"}
            "static": {},

            // Static directory base
            "staticBase": "static",

            // Index html
            // if null : file is generated
            // if non null : file is copying
            "index": null,

            // Stylesheets entry file
            "style": null,

            // Modules paths and shim for require
            "paths": {},
            "shim": {},

            // Compilers
            "compilers": {
                "css": "lessc -x -O2 %s > %s",
                "js":   "r.js -o %s"
            },

            // Arguments for application
            "args": {}
        });

        if (configs.base == null
        || configs.main == null
        || configs.build == null) {
            log("configs", "Invalid application configuration", "error");
            return -1;
        }

        // Generate require.js config file for build js code
        var generate_require_config = function() {
            var vendors_path = path.resolve(__dirname, "vendors");

            return {
                baseUrl: "./",
                name: configs.main,
                out: path.resolve(configs.build, configs.out.js),
                paths: _.extend(configs.paths || {}, {
                    "requireLib":   path.resolve(vendors_path, "require"),
                    "text":         path.resolve(vendors_path, "require-text"),
                    "Underscore":   path.resolve(vendors_path, "underscore"),
                    "jQuery":       path.resolve(vendors_path, "jquery"),
                    "yapp/yapp":    path.resolve(vendors_path, "yapp"),
                    "yapp/args":    path.resolve(configs.base, "yapp-args")
                }),
                shim: _.extend(configs.shim || {}, {
                    'Underscore': {
                        exports: '_'
                    },
                    'jQuery': {
                        exports: '$'
                    }
                }),
                include: [configs.main, "requireLib"],
                optimize: configs.debug != true ? "uglify" : "none"
            };
        };

        // Generate HTML code for application
        var generate_html = function() {
            log("html", "Generating code for application");
            if (configs.index == null) {
                fs.writeFileSync(path.resolve(configs.build, "index.html"), parse(index_html_template, configs.name, configs.out.css, configs.out.js));
            } else {
                copy_file(configs.index, path.resolve(configs.build, "index.html"));
            }
            log("html", "End of generation");
            log("html", "");
        };

        // Generate JS code
        var generate_js = function() {
            log("js", "Generating code for application");

            // Generate arguments module
            var args_file = path.resolve(configs.base, "yapp-args.js");
            fs.writeFileSync(args_file , "define(function() { return "+JSON.stringify(_.extend(configs.args || {}, {
                "revision": (new Date()).getTime(),
                "baseUrl": configs.baseUrl
            }))+"; });");

            // Generate application require build config file
            var require_config_file = path.resolve(configs.base, "require-config.js");
            var require_config = generate_require_config();
            fs.writeFileSync(require_config_file, JSON.stringify(require_config));

            // Compile application js code
            var result = exec(parse(configs.compilers.js, require_config_file));
            if (result.code != 0) {
                log("js", result.stdout, "error");
                return false;
            }
            fs.unlinkSync(require_config_file);
            fs.unlinkSync(args_file);
            log("js", "End of generation");
            log("js", "");
            return true;
        };

        // Generate static files
        var generate_static = function() {
            configs.static = configs.static || {};
            log("static", "Generating static files for application");
            _.each(configs.static, function(directory, output_path) {
                log("static", "  -> Creating "+output_path);
                wrench.copyDirSyncRecursive(directory, path.resolve(configs.build, configs.staticBase, output_path), {
                    forceDelete: true
                });
            });
            log("static", "End of generation");
            log("static", "");
        };

        // Generate static files
        var generate_stylesheet = function() {
            var input = configs.style;
            var output = path.resolve(configs.build, configs.out.css);


            log("stylesheet", "Generating style for application");

            var result = exec(parse(configs.compilers.css, input, output));
            if (result.code != 0) {
                log("stylesheet", result.stdout, "error");
                return false;
            }
            log("stylesheet", "End of generation");
            log("stylesheet", "");
        };

        // Build application
        var build = function() {
            log("build", "Start building application "+configs.name);
            log("build", "Build directory : "+configs.build);
            log("build", "");

            wrench.rmdirSyncRecursive(configs.build, true);
            wrench.mkdirSyncRecursive(configs.build, 0777);
            wrench.mkdirSyncRecursive(path.resolve(configs.build, configs.staticBase), 0777);
            
            generate_html();
            generate_js();
            generate_stylesheet();
            generate_static();
        };

        // Run application
        var run = function() {
            log("run", "Start running application "+configs.name);
            log("run", "");

            var server = express();
            //, configs.staticBase
            //, configs.staticBase
            server.use(path.resolve(configs.baseUrl),  express.static(path.resolve(configs.build)));
            /*server.get(path.resolve(configs.baseUrl, 'index.html'), function(req, res){
                res.sendfile(path.resolve(configs.build, "index.html"));
            });*/
            /*server.get('*', function(req, res){
                res.redirect(configs.baseUrl);
            });*/

            server.listen(process.env.PORT || 5000);
        };

        _cli
        .command('all')
        .description('build application code and run it.')
        .action(function(){
            build();
            run();
        });

        _cli
        .command('build')
        .description('build application code.')
        .action(build);

        _cli
        .command('run')
        .description('run simple http server for application.')
        .action(run);


        _cli
          .version('0.0.1')
          .parse(process.argv);
    }
};