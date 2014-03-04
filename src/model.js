define([
    "hr/utils",
    "jsondiffpatch",
    "hr/class",
    "hr/logger"
], function(_, jsondiffpatch, Class, Logger) {
    var logging = Logger.addNamespace("models");

    var Model = Class.extend({
        // Defaults values for attributes
        defaults : {},

        // Model unique identifier
        idAttribute: 'id',

        /*
         *  Initialize the model
         */
        initialize: function(options, attributes) {
            attributes = attributes || {};
            attributes = _.deepExtend({}, _.result(this, "defaults"), attributes);

            this._prevAttributes = null;
            this.collection = this.options.collection;
            this.attributes = {};
            this.set(attributes, {silent: true})
            return this;
        },

        /*
         * Return a copy of the model's `attributes` object.
         */
        toJSON: function(options) {
            return _.deepClone(this.attributes);
        },

        /*
         *  Get the value of an attribute.
         *  @basescope : Adress of the field (ex: field1.field2)
         *  @defaults : Default value for this field
         */
        get: function(basescope, defaults, options) {
            var scope, attributes, value;

            // Define options
            options = _.defaults(options || {}, {
                
            });

            scope = basescope.split(".");
            attributes = this.attributes;
            while (attributes && scope.length > 0) {
                currentScope = scope.shift();
                attributes = attributes[currentScope];
            }
            if (scope.length == 0 && _.isUndefined(attributes) == false) {
                return attributes;
            } else {
                return defaults;
            }
        },

        /*
         *  Define a field or a map of field
         *  @key : attribute key
         *  @value : value
         */
        set: function(key, value, options) {
            var attrs, subattrs, scope, changes, newattributes, diffs;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                attrs = key;
                options = value;
            } else {
                attrs = {};
                scope = key.split(".");
                subattrs = attrs;
                for (var i in scope) {
                    var key = scope[i];
                    if (i == (scope.length - 1)) {
                        subattrs[key] = value;
                    } else {
                        subattrs[key] = {};
                        subattrs = subattrs[key];
                    }
                }
            }

            // Define options
            options = _.defaults(options || {}, {
                silent: false
            });

            // Calcul new attributes
            newattributes = _.deepExtend({}, this.attributes || {}, attrs);
            if (!options.silent) {
                diffs = jsondiffpatch.diff(this._prevAttributes, newattributes);
                if (_.size(diffs) == 0) diffs = jsondiffpatch.diff(this.attributes, newattributes);
            }
            this._prevAttributes = this._prevAttributes == null ? _.deepClone(newattributes) : this.attributes;
            this.attributes = newattributes;

            // New unique id
            var oldId = this.id;
            if (this.idAttribute in this.attributes) {
                this.id = this.attributes[this.idAttribute];
            } else {
                this.id = this.cid;
            }
            if (oldId != this.id) this.trigger("id", this.id, oldId);

            // Calcul diffs
            if (!options.silent) {
                diffs = _.diffkeys(diffs);
                _.each(diffs, function(tag) {
                    this.trigger("change:"+tag, tag);
                }, this);
                if (diffs.length > 0) this.trigger("set", diffs);
            }

            return this;
        },

        /*
         *  Delete a attribute
         *  @key : attribute key
         */
        del: function(key) {
            var attrs, subattrs, scope, changes;

            scope = key.split(".");
            subattrs = this.attributes;
            _.each(scope, function(key, i) {
                if (i == (_.size(scope) - 1)) {
                    delete subattrs[key];
                } else {
                    subattrs = subattrs[key];
                }
            });

            this.trigger("set");
            this.trigger("del");
            return this;
        },

        /*
         *  Destroy the model
         */
        destroy: function(options) {
            this.trigger("destroy", this, this.collection, options);
            this.off();
            return this;
        },

        /*
         *  Clear attributes
         */
        clear: function(options) {
            options = _.defaults(options || {}, {
                silent: false
            });
            this.attributes = {};
            if (!options.silent) {
                this.trigger("clear");
                this.trigger("change");
            }
            return this;
        },

        /*
         *  Reset
         */
        reset: function(attributes, options) {
            options = _.defaults(options || {}, {
                silent: false
            });
            this.clear({silent: true});
            this.set(attributes, options);
            if (!options.silent) {
                this.trigger("reset");
            }
            return this;
        },

        /*
         *  Returns `true` if the attribute contains a value that is not null
         *  or undefined.
         */
        has: function(attr) {
            return this.get(attr) != null;
        }
    });

    return Model;
});