// Simple http loader using yahoo queries
// for getting page content
hr.Resources.addLoader("yql", function(query, callback, args, config) {
    _.defaults(config, {
        version: "v1",
        server: "https://query.yahooapis.com"
    });

    query = encodeURIComponent(query);

    var url = config.url || config.server+"/"+config.version+"/public/yql";
    url = url+"?format=json&q="+query+"&callback=?";

    hr.Requests.getJSON(url).then(function(data) {
        if (data.query == null || data.query.results == null) {
            return callback.reject();
        }
        return callback.resolve(data.query.results);
    }, function() {
        return callback.reject();
    })
});

// Add a simple namespace for external pages
hr.Resources.addNamespace("query", {
    loader: "yql",
    version: "v1"
});


// ...
// yql could now be use anywhere with ressource loader

// For exemple : get weather
hr.Resources.load("query", "select * from weather.forecast where woeid=2502265").then(function(result) {
    var city = result.channel.location.city;
    var condition = result.channel.item.condition.text;
    alert("Weather in "+city+" is "+condition);
}, function() {
    alert("error when loading page !");
})
