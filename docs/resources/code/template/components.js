var CateogoryView = hr.View.extend({
    template: "views/category",
    templateContext: function() {
        return {
            category: this.model.attributes,
            articles: this.model.getArticles()
        }
    }
    
    templateUpdated: function() {
        _.each(this.components.article, function(article) {
            article.on("click_edit", function() {
                this.components["category/post"].open_editor(article.model);
            });
        });
    }
});