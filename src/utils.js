/**
 * Utils module, return a LoDash/Underscore compatible API.
 *
 * @module hr/utils
 */
define([
    "lodash",
], function(_) {
    if(!Function.prototype.bind) {
        Function.prototype.bind = function(newThis) {
                var that = this;
                return function(){
                        return that.apply(newThis, arguments);
                };
        }
    }

    // Taken from jQuery, extracted here to allow this module to be used in worker
    var _extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !_.isFunction(target) ) {
            target = {};
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( _.isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && _.isArray(src) ? src : [];

                        } else {
                            clone = src && _.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = _extend( deep, clone, copy );

                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };


    var deepClone = function(obj) {
        return _extend(true, {}, obj);
    };

    var isBasicObject = function(object) {
        return (object != null
        && (object.prototype === {}.prototype|| object.prototype === Object.prototype)
        && _.isObject(object) && !_.isArray(object) && !_.isFunction(object) && !_.isDate(object)
        && !_.isRegExp(object) && !_.isArguments(object));
    };

    var basicObjects = function(object) {
        return _.filter(_.keys(object), function(key) {
                return isBasicObject(object[key]);
        });
    };

    var arrays = function(object) {
        return _.filter(_.keys(object), function(key) {
                return _.isArray(object[key]);
        });
    };

    var deepExtend = _.partial(_extend, true);

    var sum = function(obj) {
        if (!_.isArray(obj) || obj.length == 0) return 0;
        return _.reduce(obj, function(sum, n) {
            return sum += n;
        });
    };

    var deepkeys = function(obj, all) {
        var keys= [];
        var getBase = function(base, key) {
            if (_.size(base) == 0) return key;
            return base+"."+key;
        };

        var addKeys = function(_obj, base) {
            var _base, _isObject;
            base = base || "";

            _.each(_obj, function(value, key) {
                _base = getBase(base, key);
                _isObject = _.isObject(value) && !_.isArray(value);

                if (_isObject) addKeys(value, _base);
                if (all == true || !_isObject) keys.push(_base);
            });
        };

        addKeys(obj);

        return keys;
    };

    var diffkeys = function(obj) {
        var keys= [];
        var getBase = function(base, key) {
            if (_.size(base) == 0) return key;
            return base+"."+key;
        };

        var addKeys = function(_obj, base) {
            var _base, _isObject;
            base = base || "";

            _.each(_obj, function(value, key) {
                _base = getBase(base, key);
                _isObject = _.isObject(value) && !_.isArray(value);

                if (_isObject && value._t != "a") addKeys(value, _base);
                keys.push(_base);
            });
        };

        addKeys(obj);

        return keys;
    };

    _.mixin({
        deepClone: deepClone,
        isBasicObject: isBasicObject,
        basicObjects: basicObjects,
        arrays: arrays,
        deepExtend: deepExtend,
        sum: sum,
        deepkeys: deepkeys,
        diffkeys: diffkeys
    });

    return _;
});