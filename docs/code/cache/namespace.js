// Create a first cache namespace for users
var users = yapp.Cache.namespace("users");

// Create a second cache namespace for articles
var articles = yapp.Cache.namespace("articles");

users.set("samy", {
    name: "Samy Pessé"
});
articles.set("samy", {
    name: "Who is Samy?"
});

alert("User " + users.get("samy").name);
alert("Article " + articles.get("samy").name);