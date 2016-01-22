# [data.js](https://github.com/yanhaijing/data.js) [![Build Status](https://travis-ci.org/yanhaijing/data.js.svg?branch=master)](https://travis-ci.org/yanhaijing/data.js) [![license](http://img.shields.io/npm/l/express.svg)](https://github.com/yanhaijing/data.js/blob/master/MIT-LICENSE.txt) [![release](https://img.shields.io/badge/release-v0.3.0-orange.svg)](https://github.com/yanhaijing/data.js/releases/tag/v0.3.0) [![spm package](http://spmjs.io/badge/data.js)](http://spmjs.io/package/data.js)

data.js 是带有消息通知的数据中心，我称其为会说话的数据。旨在让编程变得简单，世界变得美好。

## 特性

1. 全局数据中心，可以用来存放数据，在不同程序中共享。
2. 将程序的耦合度，变为数据耦合，采用隐式调用风格，发挥js事件风格。

## 兼容性

- Node 0.10+
- Safari 6+ (Mac)
- iOS 5+ Safari
- Chrome 23+ (Windows, Mac, Android, iOS, Linux, Chrome OS)
- Firefox 4+ (Windows, Mac, Android, Linux, Firefox OS)
- Internet Explorer 6+ (Windows, Windows Phone)
- Opera 10+ (Windows, linux, Android)

## 如何使用？

### 传统用法

	//在程序的最开始处添加如下js
	<script src="data.js"></script>

### AMD

	require(['data'], function (Data) {
		***
	});

### Bower

    $ bower install data.js
    $ bower install git://github.com/yanhaijing/data.js.git

### spm

```bash
$ spm install data.js
```

### npm

	$ npm install data_js
	$ npm install yanhaijing/data.js

## 快速上手

Data常用接口只有三个，非常简单：

```javascript
Data.sub('set', 'a', function (e) {console.log(e.data)});//订阅消息，当a被设置时，会派发消息

Data.set('a', 1);//存入数据

Data.get('a');//读取数据
```

更多例子，请见目录下的[demo](demo)目录。

## 文档

[API](doc/api.md)

## 质量保证

data.js的代码运行于ecmascript严格模式下，jshint验证，完整的单元测试，并使用travis保证。测试代码见test目录下。

## 性能

data.js的存入和取出，都是对数据的一次深拷贝，同时还要解析数据的键和派发消息，所以性能会有一些损失，但不涉及大批量循环存取不会遇到性能问题。

- [get接口性能](http://jsperf.com/yanhaijing-data-js-get)
- [set接口性能](http://jsperf.com/yanhaijing-data-js-set)

## 贡献指南

如果你想为data.js贡献代码，请采用fork + pull request 方式，并在发起pr前先将master上超前的代码rebase到自己的分支上。

在目录运行如下命令，完成验证测试编译过程，确保无误：

	$ npm install -g mocha@~2.3.4 # 安装mocha
	$ npm install # 安装依赖
	$ mocha test # 运行测试代码

	$ npm install -g gulp@~3.9.0 # 安装gulp
	# gulp lint # 验证代码风格

### 发布npm
	
	$ npm publish

### 发布spm
临时将package.json中的名字修改为 data.js	

	$ spm publish

### 发布Bower
	
	$ bower register data.js git://github.com/yanhaijing/data.js.git


## 贡献者

- [yanhaijing](http://yanhaijing.com "yanhaijing's Blog")
- [Jerry Zou](https://github.com/zry656565)

## 报告问题

- [Issues](https://github.com/yanhaijing/data.js/issues "报告问题")

## 更新日志

[更新日志](CHANGELOG.md)







	

	

	


