yapp.Requests.getJSON("https://api.github.com/repos/FriendCode/yapp.js").then(function(data) {
    alert("Yapp.js github repo has "+data.watchers_count+" watchers");
}, function() {
    alert("Error !");
})