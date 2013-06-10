define([
    "Underscore",
    "yapp/core/class",
    "yapp/core/model",
    "yapp/utils/logger"
], function(_, Class, Model, Logger) {
    var logging = Logger.addNamespace("collections");

    var Collection = Class.extend({
        // Model for this colleciton
        model: Model,

        /*
         *  Initialize the colleciton
         */
        initialize: function(models, options) {
            Collection.__super__.initialize.call(this, options);
            this.models = [];
            this.reset(models || [], {silent: true});
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
            options || (options = {});
            if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
            var boundComparator = _.bind(this.comparator, this);
            if (this.comparator.length == 1) {
                this.models = this.sortBy(boundComparator);
            } else {
                this.models.sort(boundComparator);
            }
            if (!options.silent) this.trigger('reset', this, options);
            return this;
        },

        /*
         *  Reset the collection
         */
        reset: function(models, options) {
            this.models = [];
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
            var index;

            if (_.isArray(model)) {
                _.each(model, function(m) {
                    this.add(m, options);
                }, this);
                return this;
            }

            options = _.defaults(options || {}, {
                at: _.size(this.models),
                merge: false,
                silent: false
            });

            model = this._prepareModel(model);

            model.on('all', this._onModelEvent, this);
            index = options.at;
            this.models.splice(index, 0, model);

            if (this.comparator) this.sort({silent: true});
            if (options.silent) return this;
            options.index = index;
            this.trigger('add', model, this, options);
            return this;
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
                if (model.cid == m.cid) {
                    this.models.splice(i, 1);
                    index = i;
                    return;
                }
            }, this);

            if (options.silent) return this;
            options.index = index;
            this.trigger('remove', model, this, options);
            return this;
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
                model = new this.model(attrs, options);
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
        }
    });

    // Underscore methods that we want to implement on the Collection.
    var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

    // Mix in each Underscore method as a proxy to `Collection#models`.
    _.each(methods, function(method) {
        Collection.prototype[method] = function() {
            return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
        };
    });

    return Collection;
});