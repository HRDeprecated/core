var Library = hr.Collection.extend({

    model: function(attrs, options) {
        if (condition) {
            return new PublicDocument(attrs, options);
        } else {
            return new PrivateDocument(attrs, options);
        }
    }

});