yapp.Requests.get(yapp.Urls.static("templates/header.html")).then(function() {
    alert("Nice requests !");
}, function() {
    alert("Error !");
})