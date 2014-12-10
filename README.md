#[data.js](https://github.com/yanhaijing/data.js) [![Build Status](https://travis-ci.org/yanhaijing/data.js.svg?branch=master)](https://travis-ci.org/yanhaijing/data.js) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![license](http://img.shields.io/npm/l/express.svg)](https://github.com/yanhaijing/data.js/blob/master/MIT-LICENSE.txt) [![release](https://img.shields.io/badge/release-v0.2.1-orange.svg)](https://github.com/yanhaijing/data.js/releases/tag/v0.2.1) [![spm package](http://spmjs.io/badge/data.js)](http://spmjs.io/package/data.js)

data.js 是带有消息通知的数据中心，我称其为会说话的数据。旨在让编程变得简单，世界变得美好。

##Use

1. 全局数据中心，可以用来存放数据，在不同程序中共享。
2. 将程序的耦合度，变为数据耦合，采用隐式调用风格，发挥js事件风格。

##Compatibility

- Node 0.10+
- Safari 6+ (Mac)
- iOS 5+ Safari
- Chrome 23+ (Windows, Mac, Android, iOS, Linux, Chrome OS)
- Firefox 4+ (Windows, Mac, Android, Linux, Firefox OS)
- Internet Explorer 6+ (Windows, Windows Phone)
- Opera 10+ (Windows, linux, Android)

##How To Use?

###Tradition

```html	
//在程序的最开始处添加如下js
<script src="data.js"></script>
<script>
	Data.set('a', 123);
</script>
```

###AMD

```javascript
require(['data'], function (Data) {
	Data.set('a', 123);
});
```

###Bower

```bash
$ bower install data.js
```

###spm

```bash
$ spm install data.js
```

###npm

```bash
$ npm install data_js
```

```js
// *.js
var Data = require('data');
Data.set('a', 123);
```

即可使用data.js,在传统浏览器环境data.js占用全局命名空间 `Data`。

##Quick Start

Data常用接口只有三个，非常简单：

```javascript
Data.sub('set', 'a', function (e) {console.log(e.data)});//订阅消息，当a被设置时，会派发消息

Data.set('a', 1);//存入数据

Data.get('a');//读取数据
```

更多例子，请见目录下的demo目录。

##Document

[API](doc/api.md)

##Test

data.js的代码运行于ecmascript严格模式下，jshint验证，完整的单元测试，并使用travis保证。测试代码见test目录下。

##Performance Reference

data.js的存入和取出，都是对数据的一次深拷贝，同时还要解析数据的键和派发消息，所以性能会有很大损失，但不涉及大批量循环存取不会遇到性能问题。

- [get接口性能](http://jsperf.com/yanhaijing-data-js-get)
- [set接口性能](http://jsperf.com/yanhaijing-data-js-set)

##Contribution Guides

如果你想为data.js贡献代码，请采用fork + pull request 方式，并在发起pr前先将master上超前的代码rebase到自己的分支上。

在目录运行如下命令，完成验证测试编译过程，确保无误：

	$ npm install #安装grunt及其依赖
	$ grunt

##Authors

**yanhaijing**

- [Weibo](http://weibo.com/yanhaijing1234 "yanhaijing's Weibo")
- [Email](mailto:yanhaijing@yeah.net "yanhaijing's Email")
- [Blog](http://yanhaijing.com "yanhaijing's Blog")

##Issues

- [report question](https://github.com/yanhaijing/data.js/issues "report question")

##CHANGELOG

[CHANGELOG.md](CHANGELOG.md)

##Copyright

Copyright © 2013 yanhaijing. All Rights Reserved

Licensed under the MIT-LICENSE;
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:
	[http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)







	

	

	


