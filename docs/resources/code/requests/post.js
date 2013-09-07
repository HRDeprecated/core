hr.Requests.post("mybackend/test.php").then(function() {
    alert("Weird ... it wasn't suppose to work");
}, function() {
    alert("Error ! (don't worry it's normal ;) )");
})