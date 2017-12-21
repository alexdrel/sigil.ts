"use strict";
exports.__esModule = true;
function notnull(v, v1, v2) {
    return (v != null ? v : (v1 != null ? v1 : v2));
}
exports.notnull = notnull;
function defined(v, v1, v2) {
    return (v !== undefined ? v : (v1 !== undefined ? v1 : v2));
}
exports.defined = defined;
function maybe(v, func) {
    return v != null ? func(v) : v;
}
exports.maybe = maybe;
function Bool(v, strictString) {
    if (v instanceof Array) {
        return v.length > 0;
    }
    else if (v instanceof Object) {
        var r_1 = false;
        forEach(function () { return r_1 = true; }, v);
        return r_1;
    }
    else if (typeof v === 'string') {
        if (!isNaN(v)) {
            return !!(+v);
        }
        else if (strictString) {
            switch (v.toLowerCase()) {
                case 'true': return true;
                case 'false': return false;
                default: return null;
            }
        }
    }
    return !!v;
}
exports.NotNull = function (v) { return v != null; };
exports.Defined = function (v) { return v !== undefined; };
exports.Truly = function (v) { return Bool(v); };
function HostNull(_v, k, t) { return t[k] == null; }
exports.HostNull = HostNull;
function HostUndefined(_v, k, t) { return t[k] === undefined; }
exports.HostUndefined = HostUndefined;
function NotIn(_v, k, t) { return !(k in t); }
exports.NotIn = NotIn;
function forEach(func, source) {
    if (source != null) {
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                func(source[key], key, source);
            }
        }
    }
}
exports.forEach = forEach;
function assignFieldsWhen(fields, filter, target, sourceS) {
    if (target == null || filter == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    var sources = sourceS instanceof Array ? sourceS : [sourceS];
    for (var index = 0; index < sources.length; index++) {
        forEach(function (v, k) {
            if ((filter === true || filter(v, k, to)) &&
                (fields === true || fields.indexOf(k) >= 0)) {
                to[k] = v;
            }
        }, sources[index]);
    }
    return to;
}
exports.assignFieldsWhen = assignFieldsWhen;
function assignFields(fields, target, sources) {
    return assignFieldsWhen(fields, true, target, sources);
}
exports.assignFields = assignFields;
function assignWhen(filter, target, sources) {
    return assignFieldsWhen(true, filter, target, sources);
}
exports.assignWhen = assignWhen;
function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return assignFieldsWhen(true, true, target, sources);
}
exports.assign = assign;
function boolean(v, d) {
    return v == null || v === '' ?
        defined(d, exports.Defined(v) ? null : undefined) :
        notnull(Bool(v, true), d, null);
}
exports.boolean = boolean;
function number(v, d) {
    return v == null || v === '' ?
        defined(d, exports.Defined(v) ? null : undefined) :
        (isNaN(v) ? defined(d, null) : +v);
}
exports.number = number;
function string(v, d) {
    return v == null ?
        defined(d, v) :
        "" + v;
}
exports.string = string;
