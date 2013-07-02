define([
    "Underscore",
    "yapp/core/class",
    "yapp/utils/logger"
], function(_, Class, Logger) {
    var logging = Logger.addNamespace("models");

    var Joint = Class.extend({
        /*
         *  Initialize the joint with a constructor
         *  @constructor : constructor for the Model to join
         *  @attrvalue : base value of the attribute replaced by the joint
         */
        initialize: function(options, parent, constructor, attrvalue) {
            this.parent = parent;
            this.constructor = constructor;
            this.value = attrvalue;
            this.model = this.constructor(this.parent, this.value);
            return this;
        },
    });

    var Model = Class.extend({
        // Defaults values for attributes
        defaults : {},

        // Joints with others models
        joints: {},

        /*
         *  Initialize the model
         */
        initialize: function(options, attributes) {
            attributes = attributes || {};
            attributes = _.deepExtend({}, _.result(this, "defaults"), attributes);

            this.collection = this.options.collection;
            this.joints_values = {};
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
            var scope, attributes, subjoint, value;

            // Define options
            options = _.defaults(options || {}, {
                ignoreJoints: false
            });

            // Check if in joint
            value = null;
            if (!options.ignoreJoints) {
                _.each(this.joints_values, function(joint, tag) {
                    subjoint = tag+".";
                    if (basescope.indexOf(subjoint) == 0) {
                        value = joint.model.get(basescope.replace(subjoint, ""), null);
                    }
                    if (basescope == tag) {
                        value = joint.model;
                    }
                });
            }

            if (value != null) return value;

            scope = basescope.split(".");
            attributes = this.toJSON();
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
            if (_.isObject(key) || key == null) {
                attrs = key;
                options = value;
            } else {
                attrs = {};
                scope = key.split(".");
                subattrs = attrs;
                _.each(scope, function(key, i) {
                    if (i == (_.size(scope) - 1)) {
                        subattrs[key] = value;
                    } else {
                        subattrs[key] = {};
                        subattrs = subattrs[key];
                    }
                });
            }

            // Define options
            options = _.defaults(options || {}, {
                silent: false,
                joints: true
            });

            // Calcul new attributes
            this.attributes = this.attributes || {};
            newattributes = _.clone(_.deepExtend(this.toJSON(), attrs));

            // Calcul diffs
            diffs = this.diff(newattributes);

            // Update attributes
            this.attributes = newattributes;

            if (options.joints) this.updateJoints();
            if (!options.silent) {
                _.each(diffs, function(diff, tag) {
                    this.trigger("change:"+tag, diff);
                }, this);
                this.trigger("set", diffs);
            }

            return this;
        },

        /*
         *  Destroy the model
         */
        destroy: function(options) {
            this.trigger("destroy", this, this.collection, options);
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
        },

        /*
         *  Updates joints
         */
        updateJoints: function() {
            _.each(this.joints, function(constructor, tag) {
                var currentvalue = this.get(tag, null, {
                    ignoreJoints: true
                });
                if (currentvalue == null) {
                    return;
                }

                if (this.joints_values[tag] == null
                || this.joints_values[tag].value != currentvalue) {
                    this.joints_values[tag] = new Joint({}, this, constructor, currentvalue);
                }
            }, this);
        },

        /*
         *  Return the difference between the current attributes and an other state
         */
        diff: function(state) {
            var VALUE_CREATED = 'created',
            VALUE_UPDATED = 'updated',
            VALUE_DELETED = 'deleted';

            var getBase = function(base, key) {
                if (_.size(base) == 0) return key;
                return base+"."+key;
            };

            var change = function(type, oldvalue, newvalue) {
                return {
                    "type": type,
                    "before": _.clone(oldvalue),
                    "after": _.clone(newvalue)
                }
            }; 

            var mapDiff = function(a, b, base) {
                var diffs, nbase, nvalue;
                base = base || "";
                diffs = {};
                _.each(a, function(value, key) {
                    nvalue = _.isObject(b) ? b[key] : undefined;
                    nbase = getBase(base, key);
                    if (nvalue == undefined) {
                        diffs[nbase] = change(VALUE_DELETED, value);
                    }

                    if (nvalue != value) {
                        diffs[nbase] = change(VALUE_UPDATED, value, nvalue);
                    }

                    if (_.isObject(value)) {  
                        _.extend(diffs, mapDiff(value, nvalue, nbase));
                    }
                });
                _.each(b, function(value, key) {
                    nvalue = _.isObject(a) ? a[key] : undefined;
                    nbase = getBase(base, key);
                    if (nvalue == undefined) {
                        diffs[nbase] = change(VALUE_CREATED, undefined, value);
                    }
                    if (nvalue != value) {
                        diffs[nbase] = change(VALUE_UPDATED, value, nvalue);
                    }
                    if (_.isObject(value)) {
                        _.extend(diffs, mapDiff(nvalue, value, nbase));
                    }

                });
                return diffs;
            };
            
            return mapDiff(this.toJSON(), state);
        }
    });

    return Model;
});