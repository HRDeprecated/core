var ArticleView = hr.View.extend({
    template: function() {
        if (this.model.get("type") == "video") {
            return "views/article/video";
        } else {
            return "views/article/default";
        }
    }
    ...
});