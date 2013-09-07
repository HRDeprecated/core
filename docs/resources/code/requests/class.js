var r = new hr.Requests({
    url: hr.Urls.static("templates/header.html"),

    /*
    Some others options with defaults values :
        method: "GET",
        params: {},
        dataType: "text"
    */
});
r.on("done", function(content) {
    alert("content size is " + content.length);
});
r.on("error", function() {
    alert("Error in the request!");
})
r.execute();