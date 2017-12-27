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
Base.prototype.animate=function(obj){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		//为获取到的节点设置动画效果
		animate(ele,obj);
	}
	return this;
}

function animate(ele,obj){
	obj = obj || {};
	time = obj['time'] || 50;
	speed = obj['speed'] || 5;
	mulAct = obj['mulAct'] || {left : 500};
	var flag = true;
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		for(var k in mulAct){
			var attr = k.toLowerCase();
			var target = mulAct[k];
			var current = getCss(ele,attr);
			current = attr === 'opacity' ? parseFloat(current) * 100 : parseInt(current);
			step = (target - current)/speed;
			step = step < 0 ? Math.floor(step) : Math.ceil(step);
			var temp = current + step;
			if(step === 0){
				temp = target;
				flag = true;
			}else if(step < 0 && temp <= target ){
				temp = target;
				flag = true;
			}else if(step > 0 && temp >= target){
				temp = target;
				flag = true;
			}else{
				flag =false;
			}
			if(attr === 'opacity'){
				setCss(ele,attr,parseFloat(temp/100));
				setCss(ele,'filter','alpha(opacity=' + temp + ')');
			}else{
				setCss(ele,attr,temp+'px');
			}
		}
		if(flag){
			clearInterval(ele.timer);
			if(obj['fn'] !== undefined){
				obj.fn();
			}
		}
	},time);
}