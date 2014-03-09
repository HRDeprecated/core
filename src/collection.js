define([
    "hr/utils",
    "hr/promise",
    "hr/class",
    "hr/model",
    "hr/logger",
    "hr/queue"
], function(_, Q, Class, Model, Logger, Queue) {
    var logging = Logger.addNamespace("collections");

    var Collection = Class.extend({
        // Model for this colleciton
        model: Model,

        // Defaults settings
        defaults: {
            loader: null,   // Load for infinite collections
            loaderArgs: [], // Arguments for the loader
            startIndex: 0,  // Start index for infinite laoding
            limit: 10,      // Limit for infinite loading
            models: []
        },

        /*
         *  Initialize the colleciton
         */
        initialize: function(options) {
            Collection.__super__.initialize.call(this, options);
            this.queue = new Queue();
            this.models = [];
            this._byId = {};
            this._totalCount = null;
            this.reset(this.options.models || [], {silent: true});
            return this;
        },

        /*
         *  The JSON representation of a Collection is an array of the
         *  models' attributes.
         */
        toJSON: function(options) {
            return this.map(function(model){ return model.toJSON(options); });
        },

        /*
         *  Get the model at the given index.
         */
        at: function(index) {
            return this.models[index];
        },

        /*
         *  Return models with matching attributes. Useful for simple cases of `filter`.
         */
        where: function(attrs) {
            if (_.isEmpty(attrs)) return [];
            return this.filter(function(model) {
                for (var key in attrs) {
                  if (attrs[key] !== model.get(key)) return false;
                }
                return true;
            });
        },

        /*
         *  Pluck an attribute from each model in the collection.
         */
        pluck: function(attr) {
            return _.map(this.models, function(model){ return model.get(attr); });
        },

        /*
         *  Force the collection to re-sort itself. You don't need to call this under
         *  normal circumstances, as the set will maintain sort order as each item
         *  is added.
         */
        sort: function(options) {
            if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
            options = options || {};
            if (_.isString(this.comparator) || this.comparator.length === 1) {
                this.models = this.sortBy(this.comparator, this);
            } else {
                this.models.sort(_.bind(this.comparator, this));
            }
            
            if (!options.silent) this.trigger('sort', this, options);
            return this;
        },

        /*
         *  Reset the collection
         */
        reset: function(models, options) {
            options = _.defaults(options || {}, {
                totalCount: false
            });

            // Manage {list:[], n:0} for infinite list
            if (_.size(models) == 2
            && models.list != null && models.n != null) {
                this._totalCount = models.n;
                return this.reset(models.list, options);
            }

            // Remove reference
            for (var i = 0, length = this.models.length; i < length; i++) {
                this._removeReference(this.models[i], options);
            }
            options.previousModels = this.models;
            this.options.startIndex = 0;
            this.models = [];
            this._byId = {};
            if (options.totalCount) this._totalCount = null;
            this.add(models, _.extend({silent: true}, options || {}));
            options = _.defaults(options || {}, {
                silent: false
            });
            if (!options.silent) this.trigger('reset', this, options);
            return this;
        },

        /*
         *  Add a model to the collection
         *  @model : model to add
         */
        add: function(model, options) {
            var index, existing;

            if (_.isArray(model)) {
                _.each(model, function(m) {
                    this.add(m, _.clone(options));
                }, this);
                return this;
            }

            // Manage {list:[], n:0} for infinite list
            if (_.size(model) == 2
            && model.list != null && model.n != null) {
                this._totalCount = model.n;
                return this.add(model.list, options);
            }

            options = _.defaults({}, options || {}, {
                at: this.models.length,
                merge: false,
                silent: false
            });

            model = this._prepareModel(model);

            if (existing = this.get(model)) {
                if (options.merge) {
                    existing.set(model.toJSON())
                }
                return this;
            }

            this._byId[model.id] = model;

            this.listenTo(model, 'all', this._onModelEvent);
            this.listenTo(model, 'id', this._onModelId);

            index = options.at;
            this.models.splice(index, 0, model);

            if (options.silent) return this;
            options.index = index;
            this.trigger('add', model, this, options);

            if (this.comparator) this.sort({silent: options.silent});
            return this;
        },

        /*
         *  Internal method to sever a model's ties to a collection.
         */
        _removeReference: function(model, options) {
            if (this === model.collection) delete model.collection;
            this.stopListening(model);
        },

        /*
         *  Remove from model to the collection
         *  @model : model to remove
         */
        remove: function(model, options) {
            var index;

            if (_.isArray(model)) {
                _.each(model, function(m) {
                    this.remove(m, options);
                }, this);
                return this;
            }

            options = _.defaults(options || {}, {
                silent: false
            });

            model = this._prepareModel(model);

            _.each(this.models, function(m, i) {
                if (!m || model.id == m.id) {
                    this.models.splice(i, 1);
                    index = i;
                    return;
                }
            }, this);
            delete this._byId[model.id];

            if (options.silent) return this;
            options.index = index;
            if (this._totalCount != null) this._totalCount = _.max([0, this._totalCount - 1]);
            this.trigger('remove', model, this, options);
            this._removeReference(model);

            return this;
        },

        /*
         *  Pipe this colleciton into another one
         */
        pipe: function(to) {
            to.listenTo(this, "add", function(model) {
                this.add(model);
            });
            to.listenTo(this, "remove", function(model) {
                this.remove(model);
            });
            to.listenTo(this, "reset", function(colleciton, options) {
                _.each(options.previousModels, function(model) {
                    this.remove(model);
                }, this);
                collection.each(function(model) {
                    this.add(model);
                }, this);
            });

            this.each(function(model) {
                to.add(model);
            });
        },

        /*
         *  Add a model to the end of the collection.
         */
        push: function(model, options) {
            model = this._prepareModel(model, options);
            this.add(model, options);
            return model;
        },

        /*
         *  Remove a model from the end of the collection.
         */
        pop: function(options) {
            var model = this.at(this.length - 1);
            this.remove(model, options);
            return model;
        },

        /*
         *  Add a model to the beginning of the collection.
         */
        unshift: function(model, options) {
            model = this._prepareModel(model, options);
            this.add(model, _.extend({at: 0}, options));
            return model;
        },

        /*
         *  Remove a model from the beginning of the collection.
         */
        shift: function(options) {
            var model = this.at(0);
            this.remove(model, options);
            return model;
        },

        /*
         *  Prepare a model or hash of attributes to be added to this collection.
         */
        _prepareModel: function(model, options) {
            options || (options = {});
            if (!(model instanceof Model)) {
                var attrs = model;
                options.collection = this;
                model = new this.model(options, attrs);
            } else if (!model.collection) {
                model.collection = this;
            }
            return model;
        },

        /*
         *  Internal method called every time a model in the set fires an event.
         *  Sets need to update their indexes when models change ids. All other
         *  events simply proxy through. "add" and "remove" events that originate
         *  in other collections are ignored.
         */
        _onModelEvent: function(event, model, collection, options) {
            if ((event == 'add' || event == 'remove') && collection != this) return;
            if (event == 'destroy') {
                this.remove(model, options);
            }
            this.trigger.apply(this, arguments);
        },

        /*
         *  Internal method called every time a model id change
         */
        _onModelId: function(newId, oldId) {
            var m = this.get(newId);
            if (m) this.remove(m);

            this._byId[newId] = this._byId[oldId];
            delete this._byId[oldId];
        },

        /*
         *  Get a model from the set by id.
         */
        get: function(obj) {
            if (obj == null) return void 0;
            return this._byId[obj] || this._byId[obj.id];
        },

        /*
         *  Return number of elements in collections
         */
        count: function() {
            return _.size(this.models);
        },

        /*
         *  Return the total number of elements in the source (for exemple in the database)
         */
        totalCount: function() {
            return this._totalCount || this.count();
        },

        /*
         *  Get more elements from an infinite collection
         */
        hasMore: function() {
            return this.totalCount() - this.count();
        },

        /*
         *  Get more elements from an infinite collection
         */
        getMore: function(options) {
            this.queue.defer(function() {
                options = _.defaults(options || {}, {
                    refresh: false
                });
                var d, self = this;

                if (this.options.loader == null) return this;
                if (options.refresh) {
                    this.options.startIndex = 0;
                    this._totalCount = null;
                    this.reset([]);
                }

                if (this._totalCount == null || this.hasMore() > 0 || options.refresh) {
                    this.options.startIndex = this.options.startIndex || 0;
                    d = Q(this[this.options.loader].apply(this, this.options.loaderArgs || []));
                    d.done(function() {
                        self.options.startIndex = self.options.startIndex + self.options.limit
                    });
                } else {
                    d = Q.reject();
                }

                return d;
            }, this);
        },

        /*
         *  Refresh the list
         */
        refresh: function() {
            this.getMore({
                refresh: true
            });
            return this;
        },
    });

    // underscore methods that we want to implement on the Collection.
    var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

    // Mix in each underscore method as a proxy to `Collection#models`.
    _.each(methods, function(method) {
        Collection.prototype[method] = function() {
            return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
        };
    });

    return Collection;
});