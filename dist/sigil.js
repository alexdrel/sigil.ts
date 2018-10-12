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
