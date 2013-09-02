var Author = yapp.Model.extend({
    defaults: {
        "name": "",
        "fullname": ""
    },
}, {
    getByArticle: function(article) {
        return new Author({}, {
            "name": article.get("author"),
            "fullname": "Mr. "+article.get("author").toUpperCase()
        })
    }
});

var Article = yapp.Model.extend({
    defaults: {
        "title": "",
        "description": "No description for this article",
        "content": "",
        "author": "nobody",
        "interactions": {
            "comments": "",
            "likes": ""
        }
    },

    joints: {
        "author": Author.getByArticle
    }
});

var article = new Article({}, {
    "title": "My first article",
    "description": "It's my first article on this website",
    "author": "samy"
});

alert(article.get("title") + " by " + article.get("author.fullname"));


