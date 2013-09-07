define([
    "Underscore",
    "hr/core/view",
    "hr/utils/logger",
    "hr/core/collection"
], function(_, View, Logger, Collection) {

    var logging = Logger.addNamespace("lists");

    var ItemView = View.extend({
        tagName: "li",
        
        initialize: function() {
            ItemView.__super__.initialize.apply(this, arguments);
            this.collection = this.options.collection;
            this.list = this.options.list;
            return this;
        }
    });


    var ListView = View.extend({
        tagName: "ul",
        className: "",
        Item: ItemView,
        Collection: Collection,
        defaults: {
            collection: {},
            searchAttribute: null,
            displayEmptyList: true,
            displayHasMore: true,
            loadAtInit: true,
            style: "default"
        },
        styles: {
            "default": ""
        },
        events: {
            "click *[data-list-action='showmore']": "getItems"
        },
        
        /*
         *  Initialize the list view
         */
        initialize: function() {
            ListView.__super__.initialize.apply(this, arguments);
            this.setRenderStyle(this.options.style);
            this.items = {};
            if (this.options.collection instanceof Collection) {
                this.collection = this.options.collection;
            } else {
                this.collection = new this.Collection(this.options.collection);
            }
            this.collection.on("reset", function() {
                this.resetModels();
            }, this);
            this.collection.on("add", function(elementmodel, collection, options) {
                this.addModel(elementmodel, options);
            }, this);
            this.collection.on("remove", function(elementmodel) {
                this.removeModel(elementmodel)
            }, this);
            this.collection.queue.on("tasks", function() {
                this.render();
            }, this);

            this.resetModels({
                silent: true
            });

            if (this.options.loadAtInit) this.getItems();

            return this.render();
        },

        /*
         *  Add a model to the list
         *  @model : model to add
         *  @options
         */
        addModel: function(model, options) {
            var item, tag;

            // Define options
            options = _.defaults(options || {}, {
                silent: false,
                render: true,
                at: _.size(this.items),
            });
            item = new this.Item({
                "model": model,
                "list": this,
                "collection": this.collection
            });
            model.on("change", function() {
                item.render();
            });
            item.render();
            tag = this.Item.prototype.tagName+"."+this.Item.prototype.className.split(" ")[0];

            if (options.at > 0) {
                this.$(tag).eq(options.at-1).after(item.$el);
            } else {
                this.$el.prepend(item.$el);
            }
            this.items[model.cid] = item;

            if (!options.silent) this.trigger("change:add", model);
            if (options.render) this.render();

            return this;
        },

        /*
         *  Remove a model from the list
         *  @model : model to remove
         *  @options
         */
        removeModel: function(model, options) {
            // Define options
            options = _.defaults(options || {}, {
                silent: false,
                render: true
            });
            if (this.items[model.cid] == null) return this;

            this.items[model.cid].remove();
            this.items[model.cid] = null;
            delete this.items[model.cid];

            if (!options.silent) this.trigger("change:remove", model);
            if (options.render) this.render();

            return this;
        },

        /*
         *  Reset models from the collection
         */
        resetModels: function(options) {
            // Define options
            options = _.defaults(options || {}, {
                silent: false,
                render: true
            });

            _.each(this.items, function(item) {
                this.removeModel(item.model, {
                    silent: true,
                    render: false
                });
            }, this);
            this.items = {};

            // add new models
            this.collection.forEach(function(model) {
                this.addModel(model, {
                    silent: true,
                    render: false
                });
            }, this);

            if (!options.silent) this.trigger("change:reset");
            if (options.render) this.render();
            return this;
        },

        /*
         * Change render style
         * @style style to apply
         */
        setRenderStyle: function(style) {
            var c = this.styles[style];
            if (c != null) {
                this.$el.attr("class", this.className);
                this.$el.addClass(c);
                this.currentStyle = style;
            }
            return this;
        },

        /*
         *  Refresh the list
         */
        refresh: function() {
            this.collection.refresh();
            return this;
        },

        /*
         *  Return number of elements in collections
         */
        count: function() {
            return this.collection.count();
        },

        /*
         *  Return the total number of elements in the source (for exemple in the database)
         */
        totalCount: function() {
            return this.collection.totalCount();
        },

        /*
         *  Return > 0 if has more elements in the source
         */
        hasMore: function() {
            return this.collection.hasMore();
        },

        /*
         *  Load more elements from the source
         */
        getItems: function() {
            this.collection.getMore();
            return this;
        },

        /*
         *  Return items as a lists
         */
        getItemsList: function(i) {
            var a = [];
            _.each(this.items, function(item) {
                var i = this.$(this.Item.prototype.tagName).index(item.$el);
                a[i] = item;
            }, this);
            return a;
        },

        /*
         *  Filter the items list
         *  @filt : function to apply to each model
         *  @context
         */
        filter: function(filt, context) {
            var n = 0;
            if (_.isFunction(filt) == false) {
                return n;
            }
            filt = _.bind(filt, context);
            _.each(this.items, function(item) {
                if (!filt(item.model, item)) {
                    item.$el.hide();
                } else {
                    item.$el.show();
                    n = n + 1;
                }
            });
            return n;
        },

        /*
         * Search in the items
         * @query search terms
         * @options
         */
        search: function(query, options) {
            var nresults = 0, content;

            // Define options
            options = _.defaults(options || {}, {
                silent: false,
                caseSensitive: false
            });

            query = options.caseSensitive ? query : query.toLowerCase();

            nresults = this.filter(function(model, item) {
                content = this.options.searchAttribute != null ? model.get(this.searchAttribute, "") : item.$el.text();
                content = options.caseSensitive ? content : content.toLowerCase();
                return content.search(query) >= 0;
            }, this);

            if (!options.silent) this.trigger("search", {
                query: query,
                n: nresults
            });

            return this;
        },

        /*
         *  Display empty list message
         */
        displayEmptyList: function() {
            return $("<div>", {
                html: ""
            });
        },

        /*
         *  Display has more button message
         */
        displayHasMore: function() {
            var btn = $("<div>", {
                "class": "alert hr-list-message hr-list-message-more",
                "data-list-action": "showmore",
                "text": this.hasMore(),
            });
            this.$el.append(btn);
            return this;
        },

        /*
         *  Render the list
         */
        render: function() {
            this.$(".hr-list-message").remove();
            if (this.collection.queue.isComplete() == false) {
                $("<div>", {
                    "class": "hr-list-message hr-list-message-loading"
                }).appendTo(this.$el);
            } else {
                if (this.count() == 0 && this.options.displayEmptyList) {
                    var el = this.displayEmptyList();
                    $(el).addClass("hr-list-message hr-list-message-empty").appendTo(this.$el);
                }
                if (this.hasMore() > 0 && this.options.displayHasMore) this.displayHasMore();
            }
            return this.ready();
        }
    }, {
        Item: ItemView
    });

    return ListView;
});