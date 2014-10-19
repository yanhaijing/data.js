/**
 * @author yanhaijing
 */
(function (root, factory) {
    var Data = factory();
    Data.D = new Data();
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
            if (root.Data = Data) {
                root.Data = _Data;
            }
            
            return Data;
        };
        root.Data = Data;
    }
}(this, function () {
    'use strict';
    var slice = [].slice;
    var obj = {};
    var toString = obj.toString;
    var hasOwn = obj.hasOwnProperty;
    var euid = 0;
    function isFun(fn) {
        return typeof fn === 'function';
    }
    function isArr(arr) {
        return isFun(Array.isArray) ? 
            Array.isArray(arr) : toString.call(arg) === '[object Array]';
    }
    function isObj(obj) {
        return typeof obj === 'object' && !isArr(obj);
    }
    function extendDeep() {
        var target = arguments[0] || {};
        var arrs = slice.call(arguments, 1);
        var len = arrs.length;
        var copyIsArr;

        for (var i = 0; i < len; i++) {
            var arr = arrs[i];
            for (var name in arr) {
                var src = target[name];
                var copy = arr[name];
                
                //避免无限循环
                if (target === copy) {
                    continue;
                }
                
                if (copy && (isObj(copy) || (copyIsArr = isArr(copy)))) {
                    if (copyIsArr) {
                        copyIsArr = false;
                        var clone = src && isArr(src) ? src : [];

                    } else {
                        var clone = src && isObj(src) ? src : {};
                    }
                    target[ name ] = extendDeep(clone, copy);
                } else if (typeof copy !== 'undefined'){
                    target[name] = copy;
                }
            }

        }

        return target;
    }
    function parseKey(key) {
        return key.split('.');
    }
    
    function cloneDeep(src) {
        if (isObj(src)) {
            return extendDeep({}, src);
        }
        
        if (isArr(src)){
            return extendDeep({}, src);
        }
        
        return src;
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
    var Data = function () {
        this._init();
    };
    
    
    extendDeep(Data.prototype, {
        _init: function () {
            this.version = '0.1.0';
            this.context = {};
            this.events = {
                'set': {},
                'delete': {},
                'add': {},
                'update': {}
            };
        },
        set: function (key, val) {
            if (isObj(key)) {
                val = key;
                key = '';
            }
            
            if (typeof key !== 'string') {
                return false;
            }
            
            var keys = parseKey(key);
            var len = keys.length;
            var i = 0;
            var ctx = this.context;
            var nctx;
            var name;
                        
            //切换到对应上下文
            for (; i < len - 1; i++) {
                name = keys[i];
                nctx = ctx[name];
                
                //若不存在对应上下文自动创建
                if (!isArr(nctx) || !isObj(nctx)) {
                    ctx[name] = {};
                }
                
                ctx = ctx[name];
            }
            
            name = keys[i];
            
            //派发事件
            pub(this.events, 'set', key, val);
            
            if (typeof val === 'undefined') {
                pub(this.events, 'delete', key, val);
            }
            if (typeof ctx[name] === 'undefined') {
                pub(this.events, 'add', key, val);
            } else {
                pub(this.events, 'update', key, val);
            }
            
            ctx[name] = cloneDeep(val);
            
            return true;
        },
        get: function (key) {
            //key不为字符串返回null
            if (typeof key !== 'string') {
                return false;
            }
            
            var keys = parseKey(key);
            var len = keys.length;
            var i = 0;
            var ctx = this.context;
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
        sub: function (event, key, callback) {
            if (typeof event !== 'string' || typeof key !== 'string' || !isFun(callback)) {
                return -1;
            }
            
            var events = this.events[event] || {};
            
            events[key] = events[key] || {};
            
            events[key][euid++] = callback;
            
            return euid;
        },
        unsub: function (event, key, eid ) {            
            if (typeof event !== 'string' || typeof key !== 'string') {
                return false;
            }
            
            var events = this.events[event] || {};
            
            if (!isObj(events[key])) {
                return false;
            }
            
            if (typeof eid !== 'number') {
                delete events[key];               
                return true;
            }
            
            delete events[key][eid];
            
            return true;
        }
    });
    
    return Data;//return Data
}));