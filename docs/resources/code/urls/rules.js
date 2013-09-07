hr.Urls.extendRules({
     article: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args = _.map(args, function(section){
            return section.replace(/ /g,"-");
        });
        args.splice(0,0, "articles");
        return hr.Urls.base.apply(hr.Urls, args);
     }
});

alert(hr.Urls.article("my category", "my article"));