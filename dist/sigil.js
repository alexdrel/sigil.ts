export function notnull(v, v1, v2) {
    return (v != null ? v : (v1 != null ? v1 : v2));
}
export function defined(v, v1, v2) {
    return (v !== undefined ? v : (v1 !== undefined ? v1 : v2));
}
export function maybe(v, func) {
    return v != null ? func(v) : v;
}
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
export var NotNull = function (v) { return v != null; };
export var Defined = function (v) { return v !== undefined; };
export var Truly = function (v) { return Bool(v); };
export function HostNull(_v, k, t) { return t[k] == null; }
export function HostUndefined(_v, k, t) { return t[k] === undefined; }
export function NotIn(_v, k, t) { return !(k in t); }
export function forEach(func, source) {
    if (source != null) {
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                func(source[key], key, source);
            }
        }
    }
}
export function assignFieldsWhen(fields, filter, target, sourceS) {
    if (target == null || filter == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    var sources = sourceS instanceof Array ? sourceS : [sourceS];
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
export function assignFields(fields, target, sources) {
    return assignFieldsWhen(fields, true, target, sources);
}
export function assignWhen(filter, target, sources) {
    return assignFieldsWhen(true, filter, target, sources);
}
export function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return assignFieldsWhen(true, true, target, sources);
}
export function boolean(v, d) {
    return v == null || v === '' ?
        defined(d, Defined(v) ? null : undefined) :
        notnull(Bool(v, true), d, null);
}
export function number(v, d) {
    return v == null || v === '' ?
        defined(d, Defined(v) ? null : undefined) :
        (isNaN(v) ? defined(d, null) : +v);
}
export function string(v, d) {
    return v == null ?
        defined(d, v) :
        "" + v;
}
export function mergeByKeyWhen(filter, mergeKey) {
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
export function mergeByKey(mergeKey) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return mergeByKeyWhen.apply(void 0, [true, mergeKey].concat(sources));
}
export function uniqueKey(f) {
    var r = Math.random().toFixed(5);
    var u = 0;
    return function (o) {
        var k = f(o);
        return k != null ? k : "__u_" + r + "_" + ++u;
    };
}
export function copyWithSchema(schema, data) {
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
    if (Array.isArray(data) || !(data instanceof Object)) {
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
export function withDefault(p, d) {
    return function (v) { return p(v, d); };
}
