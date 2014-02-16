define([
    "underscore",
    "hr/dom",
], function(_, $) {
    if(!Function.prototype.bind) {
        Function.prototype.bind = function(newThis) {
                var that = this;
                return function(){ 
                        return that.apply(newThis, arguments); 
                };
        }
    }

    var deepClone = function(obj) {
        return $.extend(true, {}, obj);
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

    var deepExtend = _.partial($.extend, true);

    var sum = function(obj) {
        if (!$.isArray(obj) || obj.length == 0) return 0;
        return _.reduce(obj, function(sum, n) {
            return sum += n;
        });
    };

    var removeHtml = function(t) {
        return $("<div>").html(t).text();
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
        removeHtml: removeHtml,
        deepkeys: deepkeys,
        diffkeys: diffkeys
    });

    return _;
});