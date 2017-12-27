/**
 * 去除字符串两端空白
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function trim(str){
	return str.replace(/^\s+ | \s+$/g,'');
}

/**
 * 根据CSS选择器获取节点
 * @param  {[type]} str    CSS选择器
 * @param  {[type]} parent 父节点
 * @return {[type]}        元素 或 元素集合
 */
function oneSelector(str, parent){
	// 截取选择器类型 如： # .
	var tag = str.slice(0,1);
	// 截取选择器名称
	var selector = str.slice(1);
	// 父节点设置默认值
	parent = parent === undefined ? document : parent;
	//根据选择器类型不同，进行相应的操作
	switch(tag){
		// ID 选择器
		case '#' :
			return [document.getElementById(selector)]; 
		break;
		// 类选择器，由于getElementsByClassName()为新增方法，需要兼容
		case '.' : 
			return getClass(selector,parent);
		break;
		//标签选择器
		default :
			return parent.getElementsByTagName(str);
	}	
}

/**
 * 根据CSS后代选择器获取节点
 * @param  {[type]} str 后代选择器
 * @return {[type]}     [description]
 */
function mulSelector(str){
	// 拆分后代选择器为单CSS选择器数组
	var arr = str.split(/\s+/);
	//存放父节点
	var p = [];
	//存放后代
	var s = [];
	//存放单CSS选择器获取到的节点
	var t = [];

	// 循环单选择器数组
	for(var i = 0; i < arr.length; i++){
		//设置默认父节点
		if(p.length === 0){
			p[0] = document;
		}
		//清空上一次获取到的后代
		s = [];
		//循环获取所有父节点的后代
		for(var j = 0; j < p.length; j++){
			//根据CSS选取器，获取父节点的后代
			t = oneSelector(arr[i],p[j]);
			//将获取到的后代，存放到 s
			//如果后代是集合(class,tag)
			if(t.length !== undefined){
				for(var k = 0; k < t.length; k++){
					s.push(t[k]);
				}
			//后代不是集合(ID选择器)
			}else{
				s[0] = t;
			}
		}
		//获取到的后代，作为下一次循环的父节点
		p = s;
	}

	return s;
}

/**
 * 根据类名获取元素
 * @param  {[type]} selector 类名
 * @param  {[type]} parent   父节点
 * @return {[type]}          [description]
 */
function getClass(selector,parent){
	//支持getElementsByClassName的浏览器
	if(parent.getElementsByClassName !== undefined){
		return parent.getElementsByClassName(selector);
	//不支持getElementsByClassName的浏览器
	}else{
		//获取父节点下的所有标签
		var all = parent.getElementsByTagName('*');
		//存放需要的节点
		var collection = [];
		//循环所有标签节点
		for(var i = 0; i < all.length; i++){
			//如果标签的类名 等于 查找的类名，将其存放到collection
			if(all[i].className === selector){
				collection.push(all[i]);
			}
		}
		return collection;
	}
}

/**
 * 获取CSS样式
 * @param  {[type]} ele  节点对象
 * @param  {[type]} attr 属性
 * @return {[type]}      [description]
 */
function getCss(ele,attr){
	return window.getComputedStyle(ele,null)[attr];
}

/**
 * 设置CSS样式
 * @param {[type]} ele  节点对象
 * @param {[type]} attr 属性
 * @param {[type]} val  属性值
 */
function setCss(ele,attr,val){
	ele.style[attr] = val;
}

/**
 * 动画实现函数
 * @param  {[type]} ele 节点对象
 * @param  {[type]} obj 动画参数对象 形式{mulAct:{opacity:0,width:500}}
 * @return {[type]}     [description]
 */
function animate(ele,obj){
	//设置动画参数对象默认值
	obj = obj || {};
	//设置定时时间默认值
	var time = obj['time'] || 30;
	//设置缓冲速度默认值
	var speed = obj['speed'] || 3;
	//设置动画效果默认值
	var mulAct = obj['mulAct'] || {left : 500};
	//最后一个动画效果执行完成的标记
	var flag = true;
	//防止与上一次动画冲突，每次开始动画前都先清除上一次的动画
	clearInterval(ele.timer);
	//开始执行动画
	ele.timer = setInterval(function(){
		//循环执行多个动画效果
		for(var k in mulAct){
			//动画效果 ： left width opacity...
			var attr = k.toLowerCase();
			//动画结束位置、状态
			var target = mulAct[k];
			//节点当前位置、状态
			var current = getCss(ele,attr);
			current = attr === 'opacity' ? parseFloat(current) * 100 : parseInt(current);
			//根据缓冲速度计算步长
			step = (target - current)/speed;
			step = step < 0 ? Math.floor(step) : Math.ceil(step);
			//动画增量
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
			//增量赋值给节点样式
			if(attr === 'opacity'){
				setCss(ele,attr,parseFloat(temp/100));
				setCss(ele,'filter','alpha(opacity=' + temp + ')');
			}else{
				setCss(ele,attr,temp+'px');
			}
		}
		//最后一个动画执行完毕，清除定时器，如果有队列函数，执行队列函数
		if(flag){
			clearInterval(ele.timer);
			if(obj['fn'] !== undefined){
				obj.fn();
			}
		}
	},time);
}