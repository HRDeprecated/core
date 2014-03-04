define([
    "hr/utils",
    "hr/view",
    "hr/logger",
    "hr/collection"
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
            baseFilter: null
        },
        events: {
            "click *[data-list-action='showmore']": "getItems"
        },
        
        /*
         *  Initialize the list view
         */
        initialize: function() {
            ListView.__super__.initialize.apply(this, arguments);

            this._filter = null;
            this.items = {};


            if (this.options.collection instanceof Collection) {
                this.collection = this.options.collection;
            } else {
                this.collection = new this.Collection(this.options.collection);
            }
            this.listenTo(this.collection, "reset", function() {
                this.resetModels();
            });
            this.listenTo(this.collection, "sort", function() {
                this.orderItems();
            });
            this.listenTo(this.collection, "add", function(elementmodel, collection, options) {
                this.addModel(elementmodel, options);
            });
            this.listenTo(this.collection, "remove", function(elementmodel) {
                this.removeModel(elementmodel)
            });
            this.listenTo(this.collection.queue, "tasks", function() {
                this.update();
            });

            this.resetModels({
                silent: true
            });

            if (this.options.loadAtInit) this.getItems();
            if (this.options.baseFilter) this.filter(this.options.baseFilter);

            return this.update();
        },

        /*
         *  Remove the view and all children
         */
        remove: function() {
            _.each(this.items, function(view) {
                view.remove();
            });
            return ListView.__super__.remove.apply(this, arguments);
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

            if (this.items[model.id] != null) {
                this.removeModel(model);
            }

            item = new this.Item({
                "model": model,
                "list": this,
                "collection": this.collection
            });
            this.listenTo(model, "set", function() {
                item.update();
                this.applyFilter(item);
            });
            this.listenTo(model, "id", function() {
                this.items[newId] = this.items[oldId];
                delete this.items[oldId];
            });

            item.update();
            tag = this.Item.prototype.tagName;
            if (this.Item.prototype.className) tag = tag+"."+this.Item.prototype.className.split(" ")[0];

            if (options.at > 0) {
                this.$("> "+tag).eq(options.at-1).after(item.$el);
            } else {
                this.$el.prepend(item.$el);
            }
            this.items[model.id] = item;

            this.applyFilter(item);

            if (!options.silent) this.trigger("add", model);
            if (options.render) this.update();

            return this;
        },

        /*
         *  Order items in the list
         */
        orderItems: function() {
            _.each(this.items, function(item) {
                item.detach();
            }, this);

            this.collection.each(function(model) {
                var item = this.items[model.id];
                if (!item) {
                    logging.warn("sort list with non existant item");
                    return;
                }
                item.appendTo(this);
            }, this);
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

            this.stopListening(model);

            if (this.items[model.id] == null) return this;

            this.items[model.id].remove();
            this.items[model.id] = null;
            delete this.items[model.id];

            if (!options.silent) this.trigger("remove", model);
            if (options.render) this.update();

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
            this.$el.empty();

            // add new models
            this.collection.forEach(function(model) {
                this.addModel(model, {
                    silent: true,
                    render: false
                });
            }, this);

            if (!options.silent) this.trigger("reset");
            if (options.render) this.update();
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
         *  Return number of elements in the list collection
         */
        size: function() {
            return this.collection.size();
        },

        /*
         *  Return number of elements in collections visible (not filtered)
         */
        count: function() {
            return _.reduce(this.items, function(n, item) {
                if (this.applyFilter(item)) {
                    n = n + 1;
                }
                return n;
            }, 0, this);
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
            return _.map(this.items, function(item) {
                return this.$(this.Item.prototype.tagName).index(item.$el);
            }, this);
        },

        /*
         *  Apply filter on a item
         */
        applyFilter: function(item) {
            var hasFiltered = item.$el.hasClass("hr-list-fiter-on");
            var state = !(this._filter != null && !this._filter(item.model, item));
            item.$el.toggleClass("hr-list-fiter-on", !state);

            if (hasFiltered == state) this.trigger("filter", item, state);
            return state;
        },

        /*
         *  Filter the items list
         *  @filt : function to apply to each model
         *  @context
         */
        filter: function(filt, context) {
            if (_.isFunction(filt)) {
                this._filter = _.bind(filt, context);
            } else {
                this._filter = null;
            }
            
            return this.count();
        },

        /*
         *  Clear filter
         */
        clearFilter: function() {
            return this.filter(null);
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