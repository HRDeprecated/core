var _ = require("Underscore");
var yapp = require("yapp/yapp");

var q = new yapp.Queue();

var n_task = 50;
var task = function(i) {
    console.log("do requests "+ i);
    return yapp.Requests.getJSON("https://api.github.com/repos/FriendCode/yapp.js");
};

_.each(_.range(n_task), function(i) {
    q.defer(_.partial(task, i)).then(function(result) {
        console.log("requests "+i+" succeeded", result);
    }, function() {
        console.log("requests "+i+" failed");
    });
});