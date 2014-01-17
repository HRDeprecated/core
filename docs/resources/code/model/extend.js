var Article = hr.Model.extend({
    defaults: {
        "title": "",
        "description": "No description for this article",
        "content": "",
        "author": "nobody",
        "interactions": {
            "comments": "",
            "likes": ""
        }
    }
});

var article = new Article({}, {
    "title": "My first article",
    "description": "It's my first article on this website",
    "author": "Samy"
});

alert(article.get("title") + " by " + article.get("author"));


