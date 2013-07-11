// Requires
var Q = require('q');
var path = require('path');

var express = require('express');

var utils = require('./utils');

// create logger
var log = utils.logAs("run");


function Runner(config) {
    log("Start running application "+config.name);
    log("");

    this.server = express();

    // Directory to serve
    var buildDir = path.resolve(config.build);

    // Setup static middleware
    this.server.use(config.baseUrl,  express.static(buildDir));

    // Send index.html at root
    this.server.get(config.baseUrl, function(req, res) {
        res.sendfile(path.join(buildDir, 'index.html'));
    });

    // Redirect to static root
    this.server.all('*', function(req, res, next) {
        if(req.url !== config.baseUrl) {
            return res.redirect(config.baseUrl);
        }
        next();
    });
}

Runner.prototype.run = function() {
    var d = Q.defer();

    var httpServ = this.server.listen(process.env.PORT || 5000, function() {
        var address = httpServ.address();
        var addr = [address.address, address.port].join(':');

        log("Listenting on: "+addr);
        log("");

        return d.resolve(true);
    });

    httpServ.on('error', d.reject);

    return d.promise;
};


// Exports
exports.Runner = Runner;
exports.createRunner = utils.classCreator(Runner);
