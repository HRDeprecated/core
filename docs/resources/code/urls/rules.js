yapp.Urls.extendRules({
     article: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args = _.map(args, function(section){
            return section.replace(/ /g,"-");
        });
        args.splice(0,0, "articles");
        return yapp.Urls.base.apply(yapp.Urls, args);
     }
});

alert(yapp.Urls.article("my category", "my article"));