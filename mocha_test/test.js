/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

var chai = require('chai')
  , expect = chai.expect
  , Data = require('../data.js')
  , D = Data;

/***
 * 测试用例 tests
 * 注意：
 * - 在测试`sub`接口时，会监听`get`属性所定义的key
 * - `events`指的是这一个测试用例中，会被触发的事件名序列
 */

var tests = [
  {
    'set': { 'a.b.c': 1 },
    'get': { 'a.b': { c: 1 } },
    'events': [ 'add', 'set' ]
  },
  {
    'set': { 'a.b.c': [1, 2, 3] },
    'get': {
      'a.b.c.1': 2,
      'a': { b:{c:[1,2,3]} }
    },
    'events': [ 'add', 'add', 'set', 'set' ]
  },
  {
    'set': { 'a': { b:{c:[1,2,3]} } },
    'get': { 'a.b.c.2': 3 },
    'events': [ 'add', 'set' ]
  },
  {
    'set': { 'a.b.c.d.e.f': 1 },
    'get': { 'a.b.c.d.e': { f: 1 } },
    'events': [ 'add', 'set' ]
  },
  {
    'set': { 'a': [ {b:1} ] },
    'get': {
      'a.0.b': 1,
      'a': [ {b:1} ]
    },
    'events': [ 'add', 'add', 'set', 'set' ]
  }
];

function testcase(test) {
  return 'testcase: ' + JSON.stringify(test);
}

describe('Data.js', function() {
  // set timeout for asynchronous code
  this.timeout(100);

  describe('get & set', function() {

    it('simple get & set', function() {
      expect(D.get('a')).to.equal(undefined);
      D.set('a', 1);
      expect(D.get('a')).to.equal(1);
      D.clear();
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

    tests.forEach(function(test, index) {
      it('complex get & set - ' + index, function() {
        for (var key in test.set) {
          if (test.set.hasOwnProperty(key)) {
            D.set(key, test.set[key]);
          }
        }
        for (key in test.get) {
          if (test.get.hasOwnProperty(key)) {
            expect(D.get(key), testcase(test)).to.deep.equal(test.get[key]);
          }
        }
        D.clear();
      });
    });
  });

  describe('has', function() {
    it('simple has', function() {
      expect(D.has('a')).to.equal(false);
      D.set('a', 1);
      expect(D.has('a')).to.equal(true);
      D.clear();
    });
  });

  describe('sub', function() {

    it('simple sub', function(done) {
      var target
        , events = ['add', 'delete', 'set', 'set', 'set', 'update']
        , eventStack = []
        , tryDone = function() {
          if (eventStack.length >= events.length) {
            eventStack.sort(function(a, b) { return a > b; });
            expect(eventStack).to.deep.equal(events);
            D.clear();
            done();
          }
        };

      ['set', 'add', 'delete', 'update'].forEach(function(eventName) {
        D.sub(eventName, 'a', function (e) {
          expect(e).to.deep.equal({ type: eventName, key: 'a', data: target });
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

    tests.forEach(function(test, index) {
      it('complex sub - ' + index, function(done) {
        D.clear();

        var events = test.events
          , eventStack = []
          , tryDone = function() {
            if (eventStack.length >= events.length) {
              eventStack.sort(function(a, b) { return a > b; });
              events.sort(function(a, b) { return a > b; });
              expect(eventStack, testcase(test)).to.deep.equal(events);
              done();
            }
          };

        console.log(JSON.stringify(test));

        for (key in test.get) {
          if (test.get.hasOwnProperty(key)) {
            (function(key) {
              ['set', 'update', 'delete', 'add'].forEach(function(eventName) {
                D.sub(eventName, key, function (e) {
                  console.log(JSON.stringify(e));
                  expect(e).to.deep.equal({ type: eventName, key: key, data: test.get[key] });
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
      D.clear();
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