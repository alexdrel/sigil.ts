"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (Array.isArray(v)) {
        return v.length > 0;
    }
    else if (v && typeof v === 'object') {
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
    var sources = Array.isArray(sourceS) ? sourceS : [sourceS];
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        forEach(function (v, k) {
            if ((filter === true || filter(v, k, to)) &&
                (fields === true || fields.indexOf(k) >= 0)) {
                to[k] = v;
            }
        }, source);
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
function mergeByKeyWhen(filter, mergeKey) {
    var sources = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        sources[_i - 2] = arguments[_i];
    }
    var m = {};
    for (var _a = 0, sources_2 = sources; _a < sources_2.length; _a++) {
        var source = sources_2[_a];
        for (var _b = 0, source_1 = source; _b < source_1.length; _b++) {
            var item = source_1[_b];
            var key = (typeof mergeKey === 'function') ? mergeKey(item) : item[mergeKey];
            if (key != null) {
                m[key] = assignWhen(filter, m[key] || {}, item);
            }
        }
    }
    return Object.keys(m).map(function (k) { return m[k]; });
}
exports.mergeByKeyWhen = mergeByKeyWhen;
function mergeByKey(mergeKey) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return mergeByKeyWhen.apply(void 0, __spreadArrays([true, mergeKey], sources));
}
exports.mergeByKey = mergeByKey;
function uniqueKey(f) {
    var r = Math.random().toFixed(5);
    var u = 0;
    return function (o) {
        var k = f(o);
        return k != null ? k : "__u_" + r + "_" + ++u;
    };
}
exports.uniqueKey = uniqueKey;
function copyWithSchema(schema, data) {
    var _a;
    if (schema instanceof Function) {
        return schema(data);
    }
    if (Array.isArray(schema)) {
        if (Array.isArray(data)) {
            return data.map(function (e) { return copyWithSchema(schema[0], e); });
        }
        else {
            if (data === undefined) {
                return (schema.length > 1 ? [] : data);
            }
            else {
                return [copyWithSchema(schema[0], data)];
            }
        }
    }
    if (data == null) {
        return data;
    }
    if (Array.isArray(data) || typeof data !== 'object') {
        var f = schema[''] || Object.keys(schema)[0];
        data = (_a = {}, _a[f] = copyWithSchema(schema[f], data), _a);
    }
    var json = {};
    Object.keys(schema).forEach(function (k) {
        var v = copyWithSchema(schema[k], data[k]);
        if (v !== undefined) {
            json[k] = v;
        }
    });
    return json;
}
exports.copyWithSchema = copyWithSchema;
function withDefault(p, d) {
    return function (v) { return p(v, d); };
}
exports.withDefault = withDefault;
