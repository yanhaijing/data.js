var D = require('../../data.js');

D.set('a', 1234);

D.sub('set', 'a', function (e) {
    console.log('a.js', 'set a:', e.data);
});
