define([
    "hr/dom",
    "hr/utils",
    "hr/view"
], function($, _, View) {
    var Head = View.extend({
        el: $("head"),

        /*
         *  Initialize the header
         */
        initialize: function() {
            Head.__super__.initialize.apply(this, arguments);

            this._title = "";
            this._preTitle = "";
            this.app = this.options.app;

            return this;
        },

        /*
         *  Transform a page name in complete title
         */
        completeTitle: function(title) {
            if (this._preTitle.length > 0) title = this._preTitle + " " + title;
            if (_.size(title) == 0) return this.app.name;
            return title + " - " + this.app.name;
        },

        /*
         *  Set or get meta value
         *  @name : name of the meta
         *  @value : new value (if null: return current value)
         *  @metaName : value of the name selector
         */
        meta: function(name, value, metaName) {
            if (_.isObject(name)) {
                _.each(name, function(value, name) {
                    this.meta(name, value);
                }, this);
                return;
            }

            if (metaName == null) metaName = "name";
            var mt = this.$('meta['+metaName+'="'+name+'"]');
            if (mt.length === 0) {
                mt =  $("<meta>", {}).attr(metaName, name).appendTo('head');
            }
            if (value != null) {
                mt.attr('content', value);
                return this;
            } else {
                return mt.attr('content');
            }
        },

        /*
         *  Set or get link elements
         *  @rel : relationship between the current document and the linked document
         *  @href : Specifies the location of the linked document (if null : return current value)
         *  @mimetype : Specifies the MIME type of the linked document
         */
        link: function(rel, href, mimetype) {
            if (_.isObject(rel)) {
                _.each(rel, function(value, name) {
                    this.link(name, value);
                }, this);
                return;
            }

            var mt =  this.$('link[rel="'+rel+'"]');
            if (mt.length === 0) {
                mt =  $("<link>", {}).attr("rel", rel).appendTo(this.$el);
            }
            if (mimetype != null) mt.attr("type", mimetype);
            if (href != null) {
                mt.attr('href', href);
            } else {
                return mt.attr('href');
            }
        },

        /*
         *  Set or get title
         *  @value : new value for title (if null: return current value)
         *  @absolute : if true : define the all title without using the application name
         */
        title: function(value, absolute) {
            var mt =  this.$('title');
            if (mt.length === 0) {
                mt =  $("<title>", {}).appendTo(this.$el);
            }
            if (value != null) {
                this._title = value;
                if (absolute !== false) value = this.completeTitle(value);
                mt.text(value);
            } else {
                return mt.attr('content');
            }
        },

        /*
         *  Set or get the pre-title
         */
        preTitle: function(v) {
            if (v == null) return this._preTitle;
            this._preTitle = v;
            this.title(this._title);
        },

        /*
         *  Set or get description
         *  @value : new value for description
         */
        description: function(value) {
            return this.meta("description", value);
        },     

        /*
         *  Active or desactive crawling
         *  @index : indexation state (true or false)
         *  @follow : follow state (true or false) (default as index)
         */
        setCrawling: function(index, follow) {
            if (_.isNull(follow)) follow = index;
            var value = "";
            value = index ? "index" : "noindex";
            value =  value + "," + (follow ? "follow" : "nofollow");
            this.meta("robots", value);
            return this;
        },

        render: function() {
            return this;
        }
    });

    return Head;
});