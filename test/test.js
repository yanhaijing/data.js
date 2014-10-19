module('Module Set');
var D = Data.D;
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
    // D.set('a');
    // D.sub()
    // assert.ok( D.get('a') === undefined, "Passed!" );
});