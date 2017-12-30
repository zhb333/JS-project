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
		if(x.length === undefined){
			this.elements[0] = x;
		}else{
			this.elements = x;
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
Base.prototype.animate = function(obj){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		//为获取到的节点设置动画效果
		animate(ele,obj);
	}
	return this;
}

/**
 * 绑定移入移出事件
 * @param  {[type]} fn1 [description]
 * @param  {[type]} fn2 [description]
 * @return {[type]}     [description]
 */
Base.prototype.hover = function(fn1,fn2){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		ele.addEventListener('mouseover',fn1,false);
		ele.addEventListener('mouseout',fn2,false);
	}
	return this;
}

/**
 * 获取或设置left
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
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

/**
 * 获取或设置top
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
Base.prototype.top = function(val){
	if(val === undefined){
		return this.elements[0].offsetTop;
	}else{
		for(var i = 0; i<this.elements.length; i++){
			this.elements[i].style.top = val + 'px';
		}
		return this;
	}
};

/**
 * 获取或设置width
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
Base.prototype.width = function(val){
	if(val === undefined){
		return this.elements[0].offsetWidth;
	}else{
		for(var i = 0; i<this.elements.length; i++){
			this.elements[i].style.Width = val + 'px';
		}
		return this;
	}
};

/**
 * 获取或设置Height
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
Base.prototype.height = function(val){
	if(val === undefined){
		return this.elements[0].offsetHeight;
	}else{
		for(var i = 0; i<this.elements.length; i++){
			this.elements[i].style.height = val + 'px';
		}
		return this;
	}
};

/**
 * 绑定点击事件
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
Base.prototype.click = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].addEventListener('click', fn, false);
	}
	return this;
};

/**
 * 返回获取到的DOM节点
 * @return {[type]} [description]
 */
Base.prototype.getNodes=function(){
	return this.elements;
}

/**
 * 获取当前节点的索引
 * @return {[type]} [description]
 */
Base.prototype.index = function(){
	//当前节点
	var ele = this.elements[0];
	//节点名 相当于 tagName
	var nodeName = ele.nodeName;
	//父节点
	var p = ele.parentNode;
	//父节点下的所有元素节点
	var children = p.children; 
	var arr = [];
	//循环得到父节点下与当前节点标签名相同的所以元素节点
	for(var i = 0; i < children.length; i++){
		if(children[i].nodeName === nodeName){
			arr.push(children[i]);
		}
	}

	//循环判断当前节点为同标签元素节点的第几个索引，并返回索引
	for(var i = 0; i < arr.length; i++){
		if(arr[i] === ele){
			return i;
		}
	}
}

/**
 * 显示获取到的节点
 * @return {[type]} [description]
 */
Base.prototype.show=function(){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].style.display = 'block';
	}
	return this;
}

/**
 * 隐藏获取到的节点
 * @return {[type]} [description]
 */
Base.prototype.hide = function(){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].style.display = 'none';
	}
	return this;
}

/**
 * 返回指定索引的DOM节点
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
Base.prototype.eq = function(index){
	return this.elements[index];
}

/**
 * 返回节点的个数
 * @return {[type]} [description]
 */
Base.prototype.length = function(){
	return this.elements.length
};


/**
 * 设置或获取innerHTML内容
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
Base.prototype.html = function(str){
	if(str === undefined){
		return this.elements[0].innerHTML;
	}else{
		for(var i = 0; i < this.elements.length; i++){
			var ele =this.elements[i];
			ele.innerHTML = str;
		}
		return this;
	}
};

/**
 * 设置或获取透明度
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
Base.prototype.opacity = function(num){
	if(num === undefined){
		return this.elements[0].style.opacity;
	}else{
		for(var i = 0; i<this.elements.length; i++){
			var ele =this.elements[i];
			//W3C标准
			ele.style.opacity = parseFloat(num/100);
			//万恶的IE
			ele.style.filter = 'alpha(opacity='+ num +')';
		}
		return this;
	}
}

/**
 * 元素屏幕居中
 * @return {[type]} [description]
 */
Base.prototype.center = function(){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		//窗口的宽度 - 元素的宽度 / 2 + 滚动的距离
		var diffLeft = parseInt((winSize().width - ele.clientWidth)/2 + scroll().left);
		var diffTop = parseInt((winSize().height - ele.clientHeight)/2 + scroll().top);

		ele.style.left = diffLeft + 'px';
		ele.style.top = diffTop + 'px';
	}
	return this;
}

/**
 * 设置元素拖拽
 * @return {[type]} [description]
 */
Base.prototype.drag = function(obj){
	for( var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		//鼠标按下时，计算 当前鼠标坐标 - 当前元素的left/top --》 偏差值
		ele.addEventListener('mousedown',function(e){
			var diffX = e.clientX - ele.offsetLeft;
			var diffY = e.clientY - ele.offsetTop;
			//拖拽仅限于obj
			if(e.target === obj){
				//鼠标移动时，实时获取鼠标坐标 - 偏差值 --》 left/top 并不断设置left/top值
				document.addEventListener('mousemove',move ,false);

				//鼠标抬起，清除移动等事件
				document.addEventListener('mouseup',up,false);
			}

			function move(e){
				var left = e.clientX - diffX;
				var top = e.clientY - diffY;
				ele.style.left = left + 'px';
				ele.style.top = top + 'px';
				//移动过程，不让元素超出屏幕范围
				overRange(ele);
			}
			function up(e){
				document.removeEventListener('mousemove',move);
				document.removeEventListener('mouseup',up);
			}
		},false);
	}
}

/**
 * 隐藏屏幕滚动条
 * @return {[type]} [description]
 */
Base.prototype.lock = function(){
	document.documentElement.style.overflow='hidden';//隐藏滚动条
};

/**
 * 恢复屏幕滚动条
 * @return {[type]} [description]
 */
Base.prototype.unlock = function(){
	document.documentElement.style.overflow='auto';//恢复滚动条
};

/**
 * 获取或设置节点属性
 * @param  {[type]} attr [description]
 * @param  {[type]} val  [description]
 * @return {[type]}      [description]
 */
Base.prototype.attr = function(attr,val){
	for(var i = 0; i < this.elements.length; i++){
		var ele = this.elements[i];
		if(arguments.length === 1){
			return ele.getAttribute(attr);
		}else{
			ele.setAttribute(attr,val);
			return this;
		}
	}
}


Base.prototype.focus = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('focus', fn, false);
	}
	return this;
}

Base.prototype.blur = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('blur', fn, false);
	}
	return this;
}


Base.prototype.input = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('input', fn, false);
	}
	return this;
}

Base.prototype.keyup = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('keyup', fn, false);
	}
	return this;
}

Base.prototype.mousedown = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('mousedown', fn, false);
	}
	return this;
}

Base.prototype.mouseover = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('mouseover', fn, false);
	}
	return this;
}

Base.prototype.submit = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements[i];
		ele.addEventListener('submit', fn, false);
	}
	return this;
}

Base.prototype.val = function(str){
	if(str === undefined){
		return this.elements[0].value;
	}else{
		for(var i = 0; i < this.elements.length; i++){
			var ele =this.elements[i];
			ele.value = str;
		}
		return this;	
	}
}

Base.prototype.text = function(str){
	if(str === undefined){
		var ele = this.elements[0];
		return ele.innerText || ele.textContent;
	}else{
		for(var i = 0; i < this.elements.length; i++){
			var ele =this.elements;
			if(ele.innerText){
				ele.innerText = str;
			}else{
				ele.textContent = str;
			}
		}
		return this;
	}
}

Base.prototype.same = function(){
	for(var i = 0; i < this.elements.length; i++){
		var ele =this.elements;
	}
	return this;
}