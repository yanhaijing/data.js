#data.js

data.js在浏览器环境中默认占用全局变量Data，在模块化编程环境中，引用模块返回Data，返回的Data是一个数据中心+工厂函数，可直接将其作为一个数据中心使用，也可通过该函数创建新的数据中心。
	
	//一下两种方式均可获取数据中心的实例
	var D = Data();
	var D = new Data();
	
	//有一个数据中心，与上面的D无关系
	var F = new Data();

	//在实例化的数据中心上操作
	F.set(***);
	
	//在默认的数据中心上操作
	Data.set(***);

##noConflict

此函数会在以原始方式在浏览器中引入是存在，用来释放Data占用的全局变量Data。同时返回Data。

- return {Function} Data

demo

	var D = Data.noConflict();//释放Data，并赋值给D

##version

获取data.js的版本号，字符串，仅在Data上存在。

	console.log(Data.version);//0.1.0
	console.log(Data().version);//undefined

##has

判断Data中是否存在，指定的数据。

- key {String} 要判断的键，点号是分隔符，用来分隔对象层次
- return {Bollean} 是否包含指定键值

demo

	Data.has(key);//返回true或false

##get*

从Data中获取指定的键值。

- key {String} 要获取的键
- return {val} 返回与键值对应的数据，若键值的上游不存在，会返回undefined或null

demo

	Data.get('a');//undefined
	Data.get('a.b.c')//undefined

**注：**此处获取的是Data中数据的深拷贝，即get接口返回的数据是Data中对应数据的一份深拷贝。之所以牺牲性能，这样设计是因为深拷贝能避免很多难以预知的bug。

下面是深拷贝，浅拷贝和引用的区别：
	
	//深拷贝
	var a = Data.get('a');//若a为{b:{c:1}}
	a.b.c= 2;//此处更改不会影像Data中的数据
	Data.get('a.b.c')//此处输出1

	//浅拷贝
	var a = Data.get('a');//若a为{b:{c:1}}
	a.b.c= 2;
	Data.get('a.b.c')//此处输出2

	//仅返回引用
	var a = Data.get('a');//若a为{b:{c:1}}
	a.b = 1;
	Data.get('a.b')//此处输出1

##set*

向Data中放入数据。若已存在，则是扩展当前数据，不会重新赋值(对于数组或对象，对于其他类型值会覆盖)。

- key {String} 放入Data中数据的键值
- val {val} [可选] 放入Data中的数据
- return {Bollean} 是否添加成功

传入key + val 和 传入 {key: val}的方式等价，可以选择自己喜欢的方式，键值的方式更清晰，作者推荐前一种，记住只使用同一种方式会让事情变得简单。

demo
	
	//传入值类型
	D.set('a', 1);
	D.get('a');//1

	//传入引用类型
	D.set('a', {b: 1});
	D.get('a.b');//1

	D.set('a.b.c', 1);
	D.set('a', {b: {c: 1}}});//这两种功能一样

###key
key值是Data的基石，key是一个字符串，Data的key支持任何utf-8编码的字符，js支持的就可以

- 字母 abc
- 数字 123
- 特殊字符 _-+$;'"...
- 甚至是汉字 颜海镜

Data都可以完美支持，同时key还有类似对象属性的特性，a.b.c是获取a下的b下的c，其中.号是分隔符，可以想像成js中的对象（其实Data内部确实是按对象处理）。

	D.set('a', {});
	D.set('a.b', 1);
	D.set('a.c', [1]);
	D.set('a.1.1', 1);//此处会创建数组
	
`D.get('a')`的输出如下：

	{
		1: [1],
		b:1,
		c:[undefined ,1]
	}
	
Data可以将传入的键，智能转换为对应的空间，支持对象和数组。

##sub*
sub方法是Data的核心方法，用来订阅消息，订阅指定键值的指定事件，在对应的值发生变化时，会得到通知（当传入对象和数组时，消息会下发到其子元素）。

- type {String} 订阅消息的类型 （可选值：set, add, update, delete 分别代表 设置，添加，更新，删除，其中set是通用类型，其他三个为细分类型，并且互斥）
- key {String} 订阅消息的键值
- callback {Function} 消息接受函数
- return {Number} 消息的同意id用于取消订阅事件用

demo
	
	D.sub('set', 'a', function (e) {console.log(e)});
	
	D.set('a', 1);//a值更新，会调用回调函数

###e

- type {String} 消息的类型
- key {String} 消息的建
- data {val} 设置的值

##unsub

取消订阅的消息。

- type {String} 取消订阅消息的类型 （可选值：set, add, update, delete 分别代表 设置，添加，更新，删除，其中set是通用类型，其他三个为细分类型，并且互斥）
- key {String} 取消订阅消息的键值
- id {Number} [可选] sub是返回的消息的id
- return {Bollean} 是否取消成功

若id为空则会删除所有对应键值和类型的所有事件。

demo

	var id = D.sub('set', 'a', function (e) {console.log(e)});
	
	D.set('a', 1);//a值更新，会调用回调函数
	
	D.unsub('set', 'a', id);
	
	D.set('a', 1);//不会在收到通知

##注意事项

由于Data设计之初希望支持跨平台，所以要支持ecmascript类型数据，Data希望放入的是数据，期望的是原生数据，支持 Number，Bollean，String，Object，null，undefined，Array。对于Object和Array会是其深拷贝值，并且会创造层级。

对于其他类型对象js都默认为值类型，如dom节点，仅简单赋值其引用，所以消息无法下发到dom的子元素上，但get接口可以取到其子元素。其他类型对象还包括：

- window
- document
- dom
- dom list
- node list

请不要将复杂对象和引用自身的对象放入Data中，会造成性能的严重下降，和不可预知的问题。复杂对象包括如下：

- jquery对象

建议放入原生数据，对于jquery对象可传入其查询字符串。