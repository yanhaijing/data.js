var D = Data;

module('Module has');
QUnit.test( "测试has接口", function( assert ) {
    assert.ok(D.has('a') === false, "D.has('a') === false Passed!");
    D.set('a', 123);
    assert.ok(D.has('a') === true, "D.has('a') === true Passed!");
});

module('Module Set');
QUnit.test( "测试set接口", function( assert ) {
    D.set('a', 1);
    assert.ok( D.get('a') === 1, "Passed!" );
    
    D.set('a', 2);
    assert.ok( D.get('a') === 2, "Passed!" );
    
    D.set('a.b', 1);
    assert.ok( D.get('a.b') === 1, "Passed!" );
    assert.ok( typeof D.get('a') === 'object', "Passed!" );
    
    D.set('a.b.c.d.e.f', 1);
    assert.ok( D.get('a.b.c.d.e.f') === 1, "Passed!" );
    
    D.set('a', {b:1});
    assert.ok( D.get('a.b') === 1, "Passed!" );
    
    D.set('a', {b:{c: [1]}});
    assert.ok( D.get('a.b.c.0') === 1, "Passed!" );
    
    D.set('a');
    assert.ok( D.get('a') === undefined, "Passed!" );
    
    D.set('1.+-*/!@#$%^&()', 1);
    assert.ok( D.get('1.+-*/!@#$%^&()') === 1, "Passed!" );
});

module('Module get');
QUnit.test( "测试get接口", function( assert ) {
    D.set('a');
    assert.ok( D.get('a') === undefined, "Passed!" );
    assert.ok( D.get('a.b.c.d.e.f') === undefined, "Passed!" );
    assert.ok( D.get('') === undefined, "Passed!" );
    assert.ok( D.get('a-b-c-d') === undefined, "Passed!" );
});

module('Module sub');
QUnit.test( "测试sub接口", function( assert ) {
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

    D.set('test', {a: 1});
    D.sub('set', 'test', function (e) {
        assert.ok( e.data.a === 1, "e.data.a === 1 Passed!" );
        assert.ok( e.data.b === 1, "e.data.b === 1 Passed!" );
    });
    D.set('test', {b: 1});
});

module('Module unsub');
QUnit.test( "测试unsub接口", function( assert ) {
    var eid = D.sub('set', 'm', function (e) {
        assert.ok( e.type === 'set', "e.type === 'set' Passed!" );
    });
    D.set('m', 1);
    D.unsub('set', 'm', eid);
    D.set('m', 2);
    assert.ok( typeof eid === 'number', "typeof eid === 'number' Passed!" );
});

module('Module new Data');
QUnit.test( "测试new Data", function( assert ) {
    var A = new Data();
    var B = new Data();
    
    A.set('a', 123);
    B.set('a', 456);
    
    assert.ok(A.get('a') === 123, "A.get('a') === 123 Passed!");
    assert.ok(B.get('a') === 456, "B.get('a') === 456 Passed!");
});
