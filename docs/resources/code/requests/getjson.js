hr.Requests.getJSON("https://api.github.com/repos/FriendCode/hr.js").then(function(data) {
    alert("HappyRhino github repo has "+data.watchers_count+" watchers");
}, function() {
    alert("Error !");
})