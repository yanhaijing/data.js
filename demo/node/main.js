var D = require('../../data.js');
require('./a');

console.log(D.get('a'));

D.set('a', 1);

console.log(D.get('a'));
