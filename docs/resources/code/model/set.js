var article = new hr.Model({}, {
    "title": "My first article",
    "description": "It's my first article on this website",
    "author": "samy",
    "interactions": {
        "comments": 0,
        "likes": 0
    }
});
article.on("change:interactions.likes", function() {
    alert("like occurs on the article");
});

article.set("interactions.likes", 1);