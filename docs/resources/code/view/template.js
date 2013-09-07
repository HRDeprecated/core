var ArticleView = hr.View.extend({
    template: "views/test",
    templateContext: function() {
        return {
            votes: this.model.getVotes(),
            article: this.model.attributes
        }
    }
    
    ...
});