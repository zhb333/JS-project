//对象工厂
var M = function(x){
		return new Base(x);
	};

/**
 * 自定义类库构造器
 * @param {[type]} x 多态参数
 */
function Base(x){
	//存放获取到的节点
	this.elements = [];
	//根据x的类型，对应不同的操作
	//如果 x 为函数 HTML结构加载完毕，执行JS代码
	if(typeof x === 'function'){
		document.addEventListener('DOMContentLoaded',x);
	//如果 x 为字符串 为根据CSS选择器，获取节点操作
	}else if(typeof x === 'string'){
		//去除两端空白
		x = trim(x);
		//如果字符串中间有空格，根据后代选择器获取节点操作
		if(/\s+/.test(x)){
			this.elements = mulSelector(x);
		//如果字符串中间没有空格为，根据单CSS选择器获取节点操作
		}else{
			this.elements = oneSelector(x);
		}
	//如果传递的object类型,即 x 为节点对象
	}else if(typeof x === 'object'){
		this.elements[0] = x;
	}
}

/**
 * 类库的获取 || 设置 CSS样式
 * @param  {[type]} attr 样式名
 * @param  {[type]} val  样式值
 * @return {[type]}      实例对象本身
 */
Base.prototype.css=function(attr,val){
	// 只有attr参数，为获取样式
	if(arguments.length === 1){
		return getCss(this.elements[0],attr);
	//两个参数，为设置样式
	}else if(arguments.length === 2){
		//为每个获取到的节点设置样式
		for(var i =0; i < this.elements.length; i++){
			setCss(this.elements[i],attr,val);
		}
	}
	return this;
}

/**
 * 类库实现动画效果
 * @param  {[type]} obj 动画参数对象 形式{mulAct:{opacity:0,width:500}}
 * @return {[type]}     [description]
 */
Base.prototype.animate = function(obj){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		//为获取到的节点设置动画效果
		animate(ele,obj);
	}
	return this;
}

Base.prototype.hover = function(fn1,fn2){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		ele.addEventListener('mouseover',fn1,false);
		ele.addEventListener('mouseout',fn2,false);
	}
	return this;
}

Base.prototype.left = function(val){
	if(val === undefined){
		return this.elements[0].offsetLeft;
	}else{
		for(var i = 0; i<this.elements.length; i++){
			this.elements[i].style.left = val + 'px';
		}
		return this;
	}
};

