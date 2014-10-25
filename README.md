#[data.js](https://github.com/yanhaijing/data.js) [![Build Status](https://travis-ci.org/yanhaijing/data.js.svg?branch=master)](https://travis-ci.org/yanhaijing/data.js) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

data.js 是带有消息通知的数据中心，我把她称为活的数据。旨在让编程变得简单，世界变得美好。

##用途

1. 全局数据中心，可以用来存放数据，在不同程序中共享。
2. 将程序的耦合度，变为数据耦合，采用隐式调用风格，发挥js事件风格。

##兼容性

- node.js 0.10+
- Safari 6+ (Mac)
- iOS 5+ Safari
- Chrome 23+ (Windows, Mac, Android, iOS, Linux, Chrome OS)
- Firefox 4+ (Windows, Mac, Android, Linux, Firefox OS)
- Internet Explorer 6+ (Windows, Windows Phone)
- Opera 10+ (Windows, linux, Android)

##使用方法

###传统方法

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

###bower

	$ bower install data.js

###node.js

```
$ npm install data_js//从npm安装

*.js
var Data = require('data');
Data.set('a', 123);
```

即可使用data.js,在传统浏览器环境data.js占用全局命名空间 `Data`。

##快速开始

Data常用接口只有三个，非常简单：

```javascript
Data.sub('set', 'a', function (e) {console.log(e.data)});//订阅消息，当a被设置时，会派发消息

Data.set('a', 1);//存入数据

Data.get('a');//读取数据
```

更多例子，请见目录下的demo目录。

##文档

[API](doc/api.md)

##测试

data.js的代码经过完整的单元测试，并使用travis保证，可放心使用。测试代码见test目录下。

##贡献代码

如果你想为data.js贡献代码，请采用fork + pull request 方式，并在发起pr前先将master上超前的代码rebase到自己的分之上。

##作者

**yanhaijing**

- [Weibo](http://weibo.com/yanhaijing1234 "yanhaijing's Weibo")
- [Email](mailto:yanhaijing@yeah.net "yanhaijing's Email")
- [Blog](http://yanhaijing.com "yanhaijing's Blog")

##报告问题

- [issues](https://github.com/yanhaijing/data.js/issues "report question")

##版权信息

Copyright © 2013 yanhaijing. All Rights Reserved

Licensed under the MIT-LICENSE;
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:
	[http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)







	

	

	


