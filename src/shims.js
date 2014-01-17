define([
        "underscore",
        "jQuery",
], function(_, $) {
    if(!Function.prototype.bind) {
            Function.prototype.bind = function(newThis) {
                    var that = this;
                    return function(){ 
                            return that.apply(newThis, arguments); 
                    };
            }
    }

    var arrays, basicObjects, deepClone, deepExtend, isBasicObject, sum, removeHtml;

    deepClone = function(obj) {
        return $.extend(true, {}, obj);
    };

    isBasicObject = function(object) {
        return (object != null && (object.prototype === {}.prototype || object.prototype === Object.prototype) && _.isObject(object) && !_.isArray(object) && !_.isFunction(object) && !_.isDate(object) && !_.isRegExp(object) && !_.isArguments(object));
    };

    basicObjects = function(object) {
        return _.filter(_.keys(object), function(key) {
                return isBasicObject(object[key]);
        });
    };

    arrays = function(object) {
        return _.filter(_.keys(object), function(key) {
                return _.isArray(object[key]);
        });
    };

    deepExtend = _.partial($.extend, true);

    sum = function(obj) {
        if (!$.isArray(obj) || obj.length == 0) return 0;
        return _.reduce(obj, function(sum, n) {
            return sum += n;
        });
    };

    removeHtml = function(t) {
        return $("<div>").html(t).text();
    },

    _.mixin({
        deepClone: deepClone,
        isBasicObject: isBasicObject,
        basicObjects: basicObjects,
        arrays: arrays,
        deepExtend: deepExtend,
        sum: sum,
        removeHtml: removeHtml
    });

    return {};
});