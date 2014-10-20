#[data.js](https://github.com/yanhaijing/data.js) [![Build Status](https://travis-ci.org/yanhaijing/data.js.svg?branch=master)](https://travis-ci.org/yanhaijing/data.js)

data.js是一个微型js库，不仅仅是数据中心，同时是带有消息通知的数据中心，我把她称为活的数据。你不要来问我，我会通知你。

##用途

1. 全局的数据中心，可以用来存放数据，在不同程序中共享
2. 将程序的耦合度，变为数据耦合，采用隐式调用风格，发挥js事件风格。

##原理

假设我们有两个模块A和B，如果高度抽象A,B应该不会互相依赖，但如果A和B有一部分交集的话，data.js可以迅速将逻辑耦合，解耦为数据耦合。

##兼容性

- Safari 6+ (Mac)
- Chrome 23+ (Windows, Mac, Android, iOS, Linux, Chrome OS)
- Firefox 4+ (Windows, Mac, Android, Linux, Firefox OS)
iOS 5+ Safari
- Internet Explorer 6+ (Windows, Windows Phone)
- Opera 10+

##使用方法
	
	//在程序的最开始处添加如下js
	<script src="data.js"></script>

即可使用data.js,data.js占用全局变量data和D。

##set
	
set用来向D中存入数据，有2个参数，纳尼这么多，坑爹呢吧，其实后一个是可选的。

	D.set(key, val)

- key {字符串|对象} 要放到D上数据的键值，或对象值，必须
- val {任意值} 要放到D上的数据，可选，若key为对象，此项可省略，若key为键值，省略的话会删除➹值

具体用法如下：

	D.set('a', 123);//存入数字
	D.set('a', 'string')//存入字符串
	D.set('a', {})//存入对象
	
	//一下两项功能相同
	D.set(a, 123);
	D.set({a, 123]);

	D.set('a.b', 123);//设置a下的b，或a不存在则会创建a，若a为原始值此处设置不会报错，也不会生效
	

**注意**：data.js会解析key，key以点号（.）分隔不同的层级，如下：

	D.set('a.b.c.d.e.f.g', 123);若不存在的空间会自动创建


##get

get用来从D中读取数据，共有1个参数。

	D.get(key);

- key {字符串} 要获取D上数据的键值，必须

具体用法如下：

	D.get('a');//获取默认命名空间下的a
	D.get('a.b');//获取a下的b值

**注意：**如果获取的值是对象或者数组，返回的是对象或数组的深拷贝

##消息系统

消息系统data.js是核心，毕竟没有消息系统，data.js和全局变量并无两样，通过消息系统，可实现双向通信，当data中的数据有变更时，会发出消息通知，当然，前提是需要订阅才会收到通知。

	D.sub(event, key, callback);

- event 订阅的事件 add，delete，update，set（增，删，改，设置），必须
- key 订阅事件的key值，必须
- callback 事件出发时的回调函数，会传入event参数，包括type，key，ns，和data的深拷贝,必须

具体用法如下：

	D.sub('add', 'a', function (e) {console.log(e)});//当a被加进data时触发
	D.sub('delete', 'a', function (e) {console.log(e)});//当a被删除时触发
	D.sub('update', 'a', function (e) {console.log(e)});//当a被更新时触发
	D.sub('get', 'a', function (e) {console.log(e)});//当a被获取时触发
	D.sub('set', 'a', function (e) {console.log(e)});//当a被设置时触发

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







	

	

	


