/*!
 * data.js v0.2.1 (https://github.com/yanhaijing/data.js)
 * Copyright 2013 yanhaijing. All Rights Reserved
 * Licensed under MIT (https://github.com/yanhaijing/data.js/blob/master/MIT-LICENSE.txt)
 */
(function (root, factory) {
    var Data = factory(root);
    if ( typeof define === 'function' && define.amd) {
        // AMD
        define('data', function() {
            return Data;
        });
    } else if ( typeof exports === 'object') {
        // Node.js
        module.exports = Data;
    } else {
        // Browser globals
        var _Data = root.Data;
        
        Data.noConflict = function () {
            if (root.Data === Data) {
                root.Data = _Data;
            }
            
            return Data;
        };
        root.Data = Data;
    }
}(this, function (root) {
    'use strict';
    var slice = [].slice;
    var obj = {};
    var toString = obj.toString;
    var hasOwn = obj.hasOwnProperty;
    var euid = 0;
    function getType(x) {
        if(x === null){
            return 'null';
        }

        var t= typeof x;

        if(t !== 'object'){
            return t;
        }
        var c;
        // 某些类型会报错
        try {
            c = toString.call(x).slice(8, -1).toLowerCase();
        } catch(exp) {
            return 'unknow';
        }
        if(c !== 'object'){
            return c;
        }

        if(x.constructor===Object){
            return c;
        }

        return 'unknown';
    }
    function isFn(fn) {
        return getType(fn) === 'function';
    }
    function isArr(arr) {
        return Array.isArray ? Array.isArray(arr) : getType(arr) === 'array';
    }
    function isObj(obj) {
        return getType(obj) === 'object';
    }
    function extendDeep() {
        var target = arguments[0] || {};
        var arrs = slice.call(arguments, 1);
        var len = arrs.length;
        var copyIsArr;
        var clone;

        for (var i = 0; i < len; i++) {
            var arr = arrs[i];
            for (var name in arr) {
                var src = target[name];
                var copy = arr[name];
                
                //避免无限循环
                if (target === copy) {
                    continue;
                }

                // 非可枚举属性
                if (!hasOwn.call(arr, name)) {
                    continue;
                }
                
                if (copy && (isObj(copy) || (copyIsArr = isArr(copy)))) {
                    if (copyIsArr) {
                        copyIsArr = false;
                        clone = src && isArr(src) ? src : [];

                    } else {
                        clone = src && isObj(src) ? src : {};
                    }
                    target[ name ] = extendDeep(clone, copy);
                } else if (typeof copy !== 'undefined'){
                    target[name] = copy;
                }
            }

        }

        return target;
    }
    
    function pub(events, event, key, data) {
        events = events[event][key];
        
        if (isObj(events)) {
            for (var name in events) {
                if (events.hasOwnProperty(name)) {
                    events[name]({
                        type: event,
                        key: key,
                        data: data
                    });
                }
            }
        }
    }
    function extendData(key, events, context, src) {
        var nkey;
        for (var name in src) {
            var ctx = context[name];
            var copy = src[name];
            var copyIsArr;
            var isadd = false;
            var isdelete = false;
            //避免无限循环
            if (context === copy) {
                continue;
            }
            
            // 非可枚举属性
            if (!hasOwn.call(src, name)) {
                continue;
            }
                
            if (typeof copy === 'undefined') {
                isdelete = true;
            } else if (typeof context[name] === 'undefined') {
                isadd = true;
            }

            nkey = (typeof key === 'undefined' ? '' : (key + '.')) + name;
            
            if (copy && (isObj(copy) || (copyIsArr = isArr(copy)))) {                
                if (copyIsArr) {
                    copyIsArr = false;
                    context[name] = ctx && isArr(ctx) ? ctx : [];

                } else {
                    context[name] = ctx && isObj(ctx) ? ctx : {};
                }
                context[name] = extendData(nkey, events, context[name], copy);
            } else {                
                context[name] = copy;
            }
            
            pub(events, 'set', nkey, context[name]);
            
            if (isdelete) {
                pub(events, 'delete', nkey, context[name]);
            } else if (isadd) {
                pub(events, 'add', nkey, context[name]);
            } else {
                pub(events, 'update', nkey, context[name]);
            }
        }
        
        return context;
    }

    function triggerEventsForImmutable(keyPrefix, events, beforeContext, afterContext, src) {
        if (!isArr(src) && !isObj(src)) {
            pub(events, 'set', keyPrefix, src);
            if (typeof src === 'undefined') { pub(events, 'delete', keyPrefix, src); }
            else if (typeof beforeContext === 'undefined') { pub(events, 'add', keyPrefix, src); }
            else { pub(events, 'update', keyPrefix, src); }
            return;
        }
        for (var name in src) {
            if (!src.hasOwnProperty(name)) { continue; }
            var beforeVal = beforeContext && beforeContext.get && beforeContext.get(name),
                afterVal = afterContext.get(name),
                copy = src[name],
                isAdd = false,
                isDelete = false;

            if (typeof copy === 'undefined') {
                isDelete = true;
            } else if (typeof beforeVal === 'undefined') {
                isAdd = true;
            }

            var nKey = keyPrefix + '.' + name;

            triggerEventsForImmutable(nKey, events, beforeVal, afterVal, copy);

            pub(events, 'set', nKey, afterVal);

            if (isDelete) { pub(events, 'delete', nKey, afterVal); }
            else if (isAdd) { pub(events, 'add', nKey, afterVal); }
            else { pub(events, 'update', nKey, afterVal); }
        }
    }
    
    function parseKey(key) {
        return key.split('.');
    }
    
    function cloneDeep(src) {
        if (isObj(src)) {
            return extendDeep({}, src);
        }
        
        if (isArr(src)){
            return extendDeep([], src);
        }
        
        return src;
    }
    
    //Data构造函数
    var Data = function () {
        if (!(this instanceof Data)) {
            return new Data();
        }
        this._init();
    };

    var pureMethods = {
        _init: function () {
            this._context = {};
            this._events = {
                'set': {},
                'delete': {},
                'add': {},
                'update': {}
            };
        },
        set: function (key, val) {
            var ctx = this._context;

            if (typeof key !== 'string') {
                return false;
            }

            var keys = parseKey(key);
            var len = keys.length;
            var i = 0;
            var name;
            var src;
            //键值为 单个的情况
            if (len < 2) {
                src = {};
                src[key] = val;
                extendData(undefined, this._events, ctx, src);
                return true;
            }

            //切换到对应上下文
            for (; i < len - 1; i++) {
                name = keys[i];

                //若不存在对应上下文自动创建
                if (!isArr(ctx[name]) && !isObj(ctx[name])) {
                    //删除操作不存在对应值时，提前退出
                    if (typeof val === 'undefined') {
                        return false;
                    }
                    //若键值为数组则新建数组，否则新建对象
                    ctx[name] = isNaN(Number(name)) ? {} : [];
                }

                ctx = ctx[name];
            }

            name = keys.pop();

            src = isArr(ctx) ? [] : {};

            src[name] = val;

            ctx = extendData(keys.join('.'), this._events, ctx, src);

            return true;
        },
        get: function (key) {
            //key不为字符串返回undefined
            if (typeof key !== 'string') {
                return undefined;
            }

            var keys = parseKey(key);
            var len = keys.length;
            var i = 0;
            var ctx = this._context;
            var name;

            for (; i < len; i++) {
                name = keys[i];
                ctx = ctx[name];

                if (typeof ctx === 'undefined' || ctx === null) {
                    return ctx;
                }
            }

            //返回数据的副本
            return cloneDeep(ctx);
        },
        has: function (key) {
            return typeof  this.get(key) === 'undefined' ? false : true;
        },
        sub: function (type, key, callback) {
            //参数不合法
            if (typeof type !== 'string' || typeof key !== 'string' || !isFn(callback)) {
                return -1;
            }

            //不支持的事件
            if (!(type in this._events)) {
                return -2;
            }

            var events = this._events[type];

            events[key] = events[key] || {};

            events[key][euid++] = callback;

            return euid - 1;
        },
        unsub: function (type, key, id ) {
            //参数不合法
            if (typeof type !== 'string' || typeof key !== 'string') {
                return false;
            }

            //不支持的事件
            if (!(type in this._events)) {
                return false;
            }

            var events = this._events[type];

            if (!isObj(events[key])) {
                return false;
            }

            if (typeof id !== 'number') {
                delete events[key];
                return true;
            }

            delete events[key][id];

            return true;
        },
        _clear: function () {
            return this._init();
        },
        tryUseImmutable: function(immutableLib) {
            Immutable = immutableLib || root.Immutable;
            if (Immutable && Immutable.fromJS) {
                extendDeep(Data.prototype, ImmutableDataMethods);
                this._clear();
                return true;
            }
            this.isImmutable = true;
            return false;
        },
        usePure: function() {
            if (this.isImmutable) {
                extendDeep(Data.prototype, pureMethods);
                this._clear();
                return true;
            } else {
                return false;
            }
        }
    };
    
    //扩展Data原型
    extendDeep(Data.prototype, pureMethods);
    
    //新建默认数据中心
    var data = new Data();

    var Immutable;

    //扩展Data接口
    extendDeep(Data, {
        version: '0.2.1',
        has: function (key) {
            return data.has(key);
        },
        get: function (key) {
            return data.get(key);
        },
        set: function (key, val) {
            return data.set(key, val);
        },
        sub: function (type, key, callback) {
            return data.sub(type, key, callback);
        },
        unsub: function (type, key, id) {
            return data.unsub(type, key, id);
        },
        _clear: function () {
            return data._clear();
        }
    });

    var ImmutableDataMethods = {
        _init: function () {
            this._context = Immutable.Map();
            this._events = {
                'set': {},
                'delete': {},
                'add': {},
                'update': {}
            };
        },
        has: function (key) {
            return !!this.get(key);
        },
        get: function (key) {
            return this._context.getIn(parseKey(key));
        },
        set: function (key, val) {
            if (typeof key !== 'string') { return false; }

            function isImmutable(keys) {
                return !!that._context.getIn(keys).get;
            }

            function nullOrUndefined(val) {
                return typeof val === 'undefined' || val === null;
            }

            var keys = parseKey(key),
                lastKey = parseKey(key),
                that = this,
                ctx = this._context;

            if (nullOrUndefined(val)) {
                this._context = ctx.removeIn(keys);
            } else {
                // find the last one with nonempty value
                while (lastKey.length > 0 && !ctx.getIn(lastKey)) {
                    lastKey.pop();
                }
                // remove the last one with nonempty value which is not immutable object
                if (lastKey.length > 0 && !isImmutable(lastKey)) { this._context = ctx.removeIn(lastKey); }
                var originalObject = this.get(key);
                this._context = this._context.setIn(keys, originalObject ?
                    originalObject.mergeDeep(val) : Immutable.fromJS(val));
            }

            triggerEventsForImmutable(key, this._events, ctx.getIn(keys), this._context.getIn(keys), val);

            return true;
        }
    };
    
    return Data;//return Data
}));
