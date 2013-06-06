yapp.Requests.get("mybackend/test.php").then(function() {
    alert("Weird ... it wasn't suppose to work");
}, function() {
    alert("Error ! (don't worry it's normal ;) )");
})