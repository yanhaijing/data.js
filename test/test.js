/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

var Immutable = require('immutable')
  , expect = require('expect.js')
  , Data = require('../data.js')
  , D = Data();

function forEach(arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr);
  }
}

describe('Data.js', function() {
  test();
  test(true);
});

function test(isImmutable) {

  var parse = !isImmutable
                ? function(x) { return x; }
                : function(x) { return x.toJS ? x.toJS() : x; };

  describe(isImmutable? 'Immutable' : 'Pure', function() {
    // set timeout for asynchronous code
    this.timeout(1000);

    beforeEach(function() {
      isImmutable ? D.tryUseImmutable(Immutable) : D.usePure();
    });

    describe('get & set', function() {

      beforeEach(function() { D._clear(); });

      it('simple get & set', function() {
        expect(D.get('a')).to.equal(undefined);
        D.set('a', 1);
        expect(D.get('a')).to.equal(1);
      });

      it('some edge cases', function() {
        D.set('1.+-*/!@#$%^&()', 1);
        expect(D.get('1.+-*/!@#$%^&()')).to.equal(1);
        D.set('a');
        expect(D.get('a')).to.equal(undefined);
        expect(D.get('a.b.c.d.e.f')).to.equal(undefined);
        expect(D.get('')).to.equal(undefined);
        expect(D.get('a-b-c-d')).to.equal(undefined);
      });

      it('对原型链上可枚举属性的测试', function() {
        function A() {
          this.a = 1;
        }

        A.prototype = {
          b: 2
        };

        var a = new A();
        D.set('a', a);
        expect(parse(D.get('a'))).to.eql({a: 1});

        D.set('a.b', a);
        expect(parse(D.get('a'))).to.eql({a: 1, b: {a: 1}});
        expect(parse(D.get('a.b'))).to.eql({a: 1});
      });

      var tests = [
        {
          'set': { 'a.b.c': 1 },
          'get': { 'a.b': { c: 1 } }
        },
        {
          'set': { 'a.b.c': [1, 2, 3] },
          'get': {
            'a.b.c.1': 2,
            'a': { b:{c:[1,2,3]} }
          }
        },
        {
          'set': { 'a': { b:{c:[1,2,3]} } },
          'get': { 'a.b.c.2': 3 }
        },
        {
          'set': { 'a.b.c.d.e.f': 1 },
          'get': { 'a.b.c.d.e': { f: 1 } }
        },
        {
          'set': { 'a': [ {b:1} ] },
          'get': {
            'a.0.b': 1,
            'a': [ {b:1} ]
          }
        }
      ];

      forEach(tests, function(test, index) {
        it('complex get & set - ' + index, function() {
          for (var key in test.set) {
            if (test.set.hasOwnProperty(key)) {
              D.set(key, test.set[key]);
            }
          }
          for (key in test.get) {
            if (test.get.hasOwnProperty(key)) {
              expect(parse(D.get(key))).to.eql(test.get[key]);
            }
          }
        });
      });
    });

    describe('has', function() {
      it('simple has', function() {
        D._clear();
        expect(D.has('a')).to.equal(false);
        D.set('a', 1);
        expect(D.has('a')).to.equal(true);
        D._clear();
      });
    });

    describe('sub', function() {

      beforeEach(function() { D._clear(); });

      it('several steps', function() {
        var target
          , events = ['add', 'delete', 'set', 'set', 'set', 'update']
          , eventStack = []
          , tryDone = function() {
          if (eventStack.length >= events.length) {
            eventStack.sort();
            expect(eventStack).to.eql(events);
          }
        };

        forEach(['set', 'add', 'delete', 'update'], function(eventName) {
          D.sub(eventName, 'a', function (e) {
            expect(e).to.eql({ type: eventName, key: 'a', data: target });
            eventStack.push(eventName);
            tryDone();
          });
        });

        target = 1;
        D.set('a', 1);
        target = 2;
        D.set('a', 2);
        target = undefined;
        D.set('a', undefined);
      });

      /***
       * 测试用例 tests
       * 注意：`events`指的是这一个测试用例中，会被触发的事件名序列
       */
      var tests = [
        {
          'set': { 'a.b.c': [1, 2, 3] },
          'sub': {
            'a.b.c.1': 2,
            'a.b.c.2': 3
          },
          'events': [ 'add', 'add', 'set', 'set' ]
        },
        {
          'set': { 'a': { b:{c:[1,2,3]} } },
          'sub': {
            'a': { b:{c:[1,2,3]} },
            'a.b': {c:[1,2,3]},
            'a.b.c': [1,2,3],
            'a.b.c.2': 3
          },
          'events': [ 'add', 'add', 'add', 'add', 'set', 'set', 'set', 'set' ]
        }
      ];

      forEach(tests, function(test, index) {
        it('complex sub - ' + index, function() {

          var events = test.events
            , eventStack = []
            , tryDone = function(force) {
            if (force || eventStack.length >= events.length) {
              eventStack.sort();
              events.sort();
              expect(eventStack).to.eql(events);
            }
          };

          for (key in test.sub) {
            if (test.sub.hasOwnProperty(key)) {
              (function(key) {
                forEach(['set', 'update', 'delete', 'add'], function(eventName) {
                  D.sub(eventName, key, function (e) {
                    e.data = parse(e.data);
                    expect(e).to.eql({ type: eventName, key: key, data: test.sub[key] });
                    eventStack.push(eventName);
                    tryDone();
                  });
                });
              }(key));
            }
          }

          for (var key in test.set) {
            if (test.set.hasOwnProperty(key)) {
              D.set(key, test.set[key]);
            }
          }

          // done by force if number of triggered events is less than expectation
          setTimeout(function() { tryDone(true); }, 80);
        });
      });
    });

    describe('unsub', function() {
      it('simple test', function(){
        var triggerTimes = 0
          , eid = D.sub('set', 'm', function (e) { triggerTimes++; });
        D.set('m', 1);
        D.set('m', 2);
        D.unsub('set', 'm', eid);
        D.set('m', 3);
        D.set('m', 4);
        D._clear();
        expect(triggerTimes).to.equal(2);
      });
    });

    describe('multiple Data', function() {
      it('simple test', function() {
        var A = new Data();
        var B = new Data();

        A.set('a', 123);
        B.set('a', 456);

        expect(A.get('a')).to.equal(123);
        expect(B.get('a')).to.equal(456);
      });
    });
  });
}