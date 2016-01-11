/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

var chai = require('chai')
  , expect = chai.expect
  , Data = require('../data.js')
  , D = Data;

describe('Data.js', function() {
  describe('get & set', function() {

    it('simple get & set', function() {
      expect(D.get('a')).to.equal(undefined);
      D.set('a', 1);
      expect(D.get('a')).to.equal(1);
      D.clear();
    });

    var tests = [
      { 'set': { 'a.b.c': 1 }, 'get': { 'a.b': { c: 1 } } },
      { 'set': { 'a.b.c': [1, 2, 3] }, 'get': { 'a.b.c.1': 2, 'a': { b:{c:[1,2,3]} } }},
      { 'set': { 'a': { b:{c:[1,2,3]} }, 'get': { 'a.b.c.2': 3 } }},
      { 'set': { 'a.b.c.d.e.f': 1 }, 'get': { 'a.b.c.d.e': { f: 1 } }},
      { 'set': { 'a': [ {b:1} ] }, 'get': { 'a.0.b': 1, 'a': [ {b:1} ] }}
    ];

    tests.forEach(function(test, index) {
      it('complex get & set - ' + index, function() {
        for (var key in test.set) {
          if (test.set.hasOwnProperty(key)) {
            D.set(key, test.set[key]);
          }
        }
        for (key in test.get) {
          if (test.get.hasOwnProperty(key)) {
            expect(D.get(key)).to.deep.equal(test.get[key]);
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
    });
  });

  describe('sub', function() {
    it('simple sub', function(done) {
      var target
        , events = ['add', 'set', 'set', 'update']
        , eventStack = []
        , tryDone = function() {
          if (eventStack.length >= events.length) {
            eventStack.sort(function(a, b) { return a > b; });
            expect(eventStack).to.deep.equal(events);
            D.clear();
            done();
          }
        };

      D.sub('set', 'a', function (e) {
        expect(e).to.deep.equal({ type: 'set', key: 'a', data: target });
        eventStack.push('set');
        tryDone();
      });
      D.sub('add', 'a', function (e) {
        expect(e).to.deep.equal({ type: 'add', key: 'a', data: target });
        eventStack.push('add');
        tryDone();
      });
      D.sub('update', 'a', function (e) {
        expect(e).to.deep.equal({ type: 'update', key: 'a', data: target });
        eventStack.push('update');
        tryDone();
      });

      target = 1;
      D.set('a', 1);
      target = 2;
      D.set('a', 2);
    });
  });
});