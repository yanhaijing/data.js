'use strict';

var grunt = require('grunt');
var Data = require('../data.js');
var D = Data;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.data_js = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    //test.expect(2);
    var assert = test;
    
    test.ok(D.has('a') === false, "D.has('a') === false Passed!");
    D.set('a', 123);
    test.ok(D.has('a') === true, "D.has('a') === true Passed!");
    
    //===============
    D.set('a', 1);
    test.ok( D.get('a') === 1, "Passed!" );
    
    D.set('a', 2);
    test.ok( D.get('a') === 2, "Passed!" );
    
    D.set('a.b', 1);
    test.ok( D.get('a.b') === 1, "Passed!" );
    test.ok( typeof D.get('a') === 'object', "Passed!" );
    
    D.set('a.b.c.d.e.f', 1);
    test.ok( D.get('a.b.c.d.e.f') === 1, "Passed!" );
    
    D.set('a', {b:1});
    test.ok( D.get('a.b') === 1, "Passed!" );
    
    D.set('a', {b:{c: [1]}});
    test.ok( D.get('a.b.c.0') === 1, "Passed!" );
    
    D.set('a');
    test.ok( D.get('a') === undefined, "Passed!" );
    
    D.set('1.+-*/!@#$%^&()', 1);
    test.ok( D.get('1.+-*/!@#$%^&()') === 1, "Passed!" );
    
    D.set('a');
    D.set('a', {b: 1});
    D.set({a: {c: 1}});
    assert.ok( D.get('a.b') === 1, "Passed!" );
    assert.ok( D.get('a.c') === 1, "Passed!" );
    
    //======================
    D.set('a');
    assert.ok( D.get('a') === undefined, "Passed!" );
    assert.ok( D.get('a.b.c.d.e.f') === undefined, "Passed!" );
    assert.ok( D.get('') === undefined, "Passed!" );
    assert.ok( D.get('a-b-c-d') === undefined, "Passed!" );
    
    //============================
    D.set('a');
    D.sub('set', 'a', function (e) {
        assert.ok( e.type === 'set', "e.type === 'set' Passed!" );
        assert.ok( e.key === 'a', "e.key === 'a' Passed!" );
        assert.ok( e.data === 1, "e.data === 1 Passed!" );
    });
    D.sub('add', 'a', function (e) {
        assert.ok( e.type === 'add', "e.type === 'add' Passed!" );
        assert.ok( e.key === 'a', "e.key === 'a' Passed!" );
        assert.ok( e.data === 1, "e.data === 1 Passed!" );
    });
    D.sub('update', 'a', function (e) {
        assert.ok( e.type === 'update', "e.type === 'update' Passed!" );
        assert.ok( e.key === 'a', "e.key === 'a' Passed!" );
        assert.ok( e.data === 1, "e.data === 1 Passed!" );
    });
    D.set('a', 1);
    D.set('a', 1);
    
    D.sub('set', 'b.c.d', function (e) {
        assert.ok( e.data === 123, "e.data === 123 Passed!" );
    });
    D.set('b.c.d', 123);
    D.set('b.c', {d: 123});
    
    //======================
    var eid = D.sub('set', 'm', function (e) {
        assert.ok( e.type === 'set', "e.type === 'set' Passed!" );
    });
    D.set('m', 1);
    D.unsub('set', 'm', eid);
    D.set('m', 2);
    assert.ok( typeof eid === 'number', "typeof eid === 'number' Passed!" );
    
    //=================
    var A = new Data();
    var B = new Data();
    
    A.set('a', 123);
    B.set('a', 456);
    
    assert.ok(A.get('a') === 123, "A.get('a') === 123 Passed!");
    assert.ok(B.get('a') === 456, "B.get('a') === 456 Passed!");
    
    test.done();
  }
};