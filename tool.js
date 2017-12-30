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
 * @param  {[type]} obj 动画参数对象 形式{mulAct:{opacity:0,width:500},fn:function(){},speed:5,time:50}
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


/**
 * 获取上一索引
 * @param  {[type]} num   [description]
 * @param  {[type]} total [description]
 * @return {[type]}       [description]
 */
function previous(num, total){
	return num <= 0 ? total -1 : num -1; 
}
/**
 * 获取下一个索引
 * @param  {[type]}   num   [description]
 * @param  {[type]}   total [description]
 * @return {Function}       [description]
 */
function next(num, total){
	return num >= total - 1 ? 0 : num + 1;
}


/**
 * 轮播图
 * @param  {[type]} obj 参数对象 调用方式： ｛imgs:imgs,dots:dots,text:null,type:1,time:3000｝
 * @return {[type]}     [description] 
 */
function banner(obj){
	//设置轮播类型默认值
	obj.type = obj.type === undefined ? 1 : obj.type;
	//存放定时器返回的ID
	var timer = null;
	//自动轮播下一个节点的索引
	var num = 1;
	
	//鼠标移入小圆点，停止自动轮播，手动轮播到当前小圆点对于的图片节点
	obj.dots.hover(function(){
		clearInterval(timer);
		bannerAct(this);
	//鼠标移出小圆点，重新设置下一个节点的索引，开启自动轮播
	},function(){
		num = M(this).index() + 1;
		timer = setInterval(autoAct,obj.time);
	});

	//默认自动轮播
	timer = setInterval(autoAct,obj.time);

	/**
	 * 自动轮播实现函数
	 * @return {[type]} [description]
	 */
	function autoAct(){
		//控制节点索引的范围
		num = num >= obj.dots.length() ? 0 : num;
		bannerAct(obj.dots.eq(num));
		//自动进入下一个索引
		num++;
	}

	/**
	 * 轮播效果，具体实现函数
	 * @param  {[type]} dot 节点索引代表的小圆点
	 * @return {[type]}     [description]
	 */
	function bannerAct(dot){
		//使用类库，实例化小圆点对象
		var dot = M(dot);
		//设置所有小圆点的样式
		obj.dots.css('color','#000');
		//设置当前小圆点的样式
		dot.css('color','#FF6666');
		//通过当前小圆点得到小圆点对应的索引
		var num = dot.index();
		//通过索引获取当前图片
		var img = M(obj.imgs.eq(num));
		//所有图片的个数
		var total = obj.imgs.length();
		//获取上一个索引
		var preNum = previous(num, total);

		//类型一的轮播效果，透明度渐变
		if(obj.type === 1){
			//设置所有图片（透明），z轴坐标为1
			obj.imgs.css('zIndex',1).opacity(0);
			//设置上一张图片从（不透明）到（透明）的动画
			M(obj.imgs.eq(preNum)).opacity(100).animate({mulAct:{opacity : 0},time : 100});
			//设置当前图片的z轴坐标为2，从（透明）到（不透明）的动画
			img.css('zIndex',2).opacity(0).animate({mulAct:{opacity : 100},time : 100});
		//类型二的轮播效果，左右切换
		}else if(obj.type === 2){
			//设置所有图片（不透明），z轴坐标为1
			obj.imgs.css('zIndex',1).opacity(100);
			//设置上一张图片，从x轴 0 到图片的 正的(宽度) 移动的动画
			M(obj.imgs.eq(preNum)).left(0).animate({mulAct:{left : img.width()},time : 100});
			//设置当前图片，从x轴图片 负的（宽度） 到 0 移动的动画 
			img.css('zIndex',2).left(-img.width()).animate({mulAct:{left : 0},time : 100});
		}

		//如果有文字对象，则设置文字
		if(obj.text !== null){
			obj.text.html(obj.imgs.eq(num).innerHTML);
		}
	}
}

/**
 * 获取屏幕滚动的距离
 * @return {[type]} [description]
 */
function scroll(){
	return {
		left : window.pageXOffset|| document.documentElement.scrollLeft || document.body.scrollLeft,
		top : window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop
	}
}

/**
 * 获取窗口的宽高
 * @return {[type]} [description]
 */
function winSize(){
	return {
		width : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		height : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	}
}


/**
 * 元素超出屏幕的处理函数
 * @param  {[type]} box [description]
 * @return {[type]}     [description]
 */
function overRange(box){
	//滚动距离
	var scrollLeft = parseInt(scroll().left);
	var scrollTop = parseInt(scroll().top);
	//最大的偏移距离
	var maxLeft = scrollLeft + winSize().width - box.clientWidth;
	var maxTop = scrollTop + winSize().height - box.clientHeight;
	//当前的距离
	var left = box.offsetLeft;
	var top = box.offsetTop;

	//如果当前的距离 < 屏幕滚动的距离，则设置当前距离为屏幕滚动的距离
	if(left <= scrollLeft ){
		left = scrollLeft;
	//如果当前距离大于最大的偏移距离，则设置当前距离为最大的偏移距离
	}else if(left >= maxLeft){
		left = maxLeft;
	}
	box.style.left = left + 'px';

	if(top <= scrollTop ){
		top = scrollTop;
	}else if(top >= maxTop){
		top = maxTop;
	}
	box.style.top = top + 'px';
};

/**
 * 锁屏函数实现
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
function screenLock(ele){
	//宽度为屏幕宽度 + 滚动的距离
	ele.style.width = winSize().width +　scroll().left + 'px';
	//高度为屏幕高度 + 滚动的距离
	ele.style.height = winSize().height +　scroll().top + 'px';
	//显示锁屏
	ele.style.display = 'block';
}

/**
 * 解锁函数
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
function screenUnlock(ele){
	//隐藏锁屏元素
	ele.style.display = 'none';
}


/**
 * 表单序列化
 * @param  {[type]} form [description]
 * @return {[type]}      [description]
 */
function serialize(form){
	var data={};
	for(var i=0;i<form.elements.length;i++){
		var ele=form.elements[i];
		switch(ele.type){
			case 'button':
			case 'submit':
			case 'file':
			case 'reset':
			case undefined:
			break;
			case 'select-one':
			case 'select-multiple':
				var options=ele.options;
				var op_arr=[];//多选
				for(var k=0;k<options.length;k++){
					var op=options[k];
					if(op.selected){
						if(op.hasAttribute('value')){
							op_arr.push(op.value);
						}else{
							op_arr.push(op.text);
						}
					}
				}
				data[ele.name]=op_arr.length<=1?op_arr[0] : op_arr;
				break;
			case 'radio':
			case 'checkbox':
				if(!ele.checked){
					break;
				}
			default:
				data[ele.name]=data[ele.name]==undefined?ele.value : data[ele.name]+','+ele.value;
		}
	}

	return data;
}



function get(url){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			if(xhr.status === 200){
				return xhr.responseText;
			}else{
				throw new Error('请求失败，错误码：　' +　xhr.status + '错误原因： ' + xhr.statusText);
			}
		}
	}

	xhr.open('get',url);
	xhr.send();
}

function post(url,data){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			if(xhr.status === 200){
				return xhr.responseText;
			}else{
				throw new Error('请求失败，错误码：　' +　xhr.status + '错误原因： ' + xhr.statusText);
			}
		}
	}
	xhr.open('post',url);
	xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
	xhr.send(data);
}


/**
 * ajax 
 * @param  {[type]} obj 传参方式 ｛url : url , data :　data, method : method, scyn : scyn, fn : fn｝
 * @return {[type]}     [description]
 */
function ajax(obj){
	var xhr = new XMLHttpRequest();//初始化xhr对象
	var url = obj.url;//url
	var data = obj.data;//组装数据

	if(obj.method.toLowerCase() == 'get'){//get请求，数据通过url传递
		url += url.indexOf('?')>-1? '&' : '?';
		url += data;
	}

	if(obj.scyn === true){//异步请求，xhr监听请求过程
		xhr.onreadystatechange=function(){
			if(xhr.readyState === 4){
				ajax.callBack(xhr,obj);
			}
		}
	}
	xhr.open(obj.method, url, obj.scyn);//准备请求

	if(obj.method.toLowerCase() == 'get'){//get请求send参数为null
		xhr.send(null);
	}

	if(obj.method.toLowerCase() == 'post'){//post请求 通过send 传递参数
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	}

	if(obj.scyn === false){//同步请求，等待请求完毕后执行
		ajax.callBack(xhr,obj);
	}
}

//请求完毕后的执行函数
ajax.callBack=function(xhr,obj){
	if(xhr.status == 200){
		obj.fn(xhr.responseText);
	}else{
		throw new Error('请求发生错误！\n错误代码： '+xhr.status+' 错误描述：'+xhr.statusText);
	}
}

function createData(data){
	var arr=[];
	for(var i in data){
		arr.push(encodeURIComponent(i)+'='+encodeURIComponent(data[i]));
	}
	return arr.join('&');
}