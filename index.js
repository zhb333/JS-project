/**
 * 动画导航                                       [description]
 */
M(function(){
	//导航列表
	var aboveLis = M('#nav-above li');
	//移动块
	var navMove = M('#nav-move');
	//移动块中的导航列表
	var navWhite = M('#nav-white');
	//鼠标移入，移动块滑动到鼠标位置
	aboveLis.hover(function(){
		//鼠标悬停的位置
		var left = M(this).left();
		navMove.animate({mulAct : {left : 20 + left}, fn : function(){
			navWhite.animate({mulAct : {left : -left}});
		}});
	//鼠标移出，移动块滑动到初始位置
	},function(){
		navMove.animate({mulAct : {left : 20}, fn : function(){
			navWhite.animate({mulAct : {left : 0}});
		}});
	});
	
});

/**
 * 换肤                                        [description]
 */
M(function(){
	// 皮肤上层列表
	var skinLis = M('#skin li');
	// 移动框
	var skinMove = M('#skin-move');
	// 初始化皮肤
	var bgId = 3;
	var skinLi = skinLis.getNodes()[bgId -1];
	//初始化body背景
	setBodyBg(skinLi);
	//初始化移动框
	skinMove.css('left',skinLi.offsetLeft + 25 + 'px');

	//点击某个皮肤，重新设置皮肤 及 重新设置body背景
	skinLis.click(function(){
		setBodyBg(this);
		skinLi = this;
	});

	// 鼠标移入皮肤，移动框移动到当前位置
	skinLis.hover(function(){
		var left = M(this).left();
		skinMove.animate({mulAct : {left : 25 + left}});
	// 鼠标移出皮肤，移动框移动到设定皮肤的位置
	},function(){
		skinMove.animate({mulAct : {left : skinLi.offsetLeft + 25}});
	});

	/**
	 * 设置body背景
	 * @param {[type]} skinLi [description]
	 */
	function setBodyBg(skinLi){
		var newImg = new Image();
		newImg.onload = function(){
			M('body').css('background',skinLi.getAttribute('bgc') + ' url('+ newImg.src +') repeat-x');
		};
		newImg.src = skinLi.getAttribute('src');
	}
});

/** 轮播图左侧
**/
M(function(){
	//左侧导航列表
	var lis = M('#banner-left li');
	//列表的第一个节点
	var lisOne = lis.elements[0];
	//第一个节点的实际高度
	var lisOneH = lisOne.offsetHeight;
	//margin-bottom值
	var lisOneMB = parseInt(getCss(lisOne, 'marginBottom'));
	//覆盖块
	var covers = M('.banner-cover');
	//第一个覆盖块的top值
	var coverFirstT = parseInt(getCss(covers.eq(0), 'top'));
	//每一个覆盖块top值的增量
	var coverSingleT = lisOneH + lisOneMB;
	//导航列表的详细展示区域
	var boxs = M('.banner-box');

	//循环初始化每个覆盖块的位置
	for(var i = 0; i < covers.length(); i++){
		var coverNode = covers.eq(i);
		coverNode.style.top = coverFirstT + i * coverSingleT + 'px';
	}

	//鼠标滑入左侧导航列表，显示该列表节点下的覆盖快，以及该节点下详细展示区域
	lis.hover(function(){
		//当前列表节点的索引
		var index = M(this).index();
		//显示当前覆盖块
		M(covers.eq(index)).show();
		//显示当前详细展示区域
		M(boxs.eq(index)).show().animate({mulAct:{opacity:100},time:60});
	},function(){
		//隐藏所有覆盖快
		covers.hide();
		//隐藏所有展示区域
		boxs.hide().opacity(0);
	});

});


/**轮播图中间**/
M(function(){
	var imgs = M('#banner-center .banner-img');
	var dots = M('#banner-center .banner-dot li');
	var text = M('#banner-center .banner-text');

	banner({imgs:imgs,dots:dots,text:text,type:1,time:3000});
});


/**轮播图右侧**/
M(function(){
	var imgs = M('#banner-right .banner-img');
	var dots = M('#banner-right .banner-dot li');
	banner({imgs:imgs,dots:dots,text:null,type:2,time:2000});
});

/**拖拽 & 预加载**/
M(function(){
	//移动框
	var move = M('#load-move');
	//图片上层列表
	var aboveLis = M('#load-above li');
	//图片
	var imgs = M('#load img');
	//弹框
	var box = M('#drag .box');
	//弹框关闭按钮
	var boxClose = M('#drag .close');
	//锁屏
	var screen = M('#screen');
	// 弹框头部
	var head = M('#drag .head h3');
	//loading图片
	var loading = M('#drag .loading');
	//大图
	var bigImg = M('#drag .img');

	//大图分左右两侧 
	//左侧
	var imgLeft = M('#img-left');
	//右侧
	var imgRight = M('#img-right');
	//左箭头
	var goLeft = M('#go-left');
	//右箭头
	var goRight = M('#go-right');
	//鼠标移动到上层列表，移动框移动到当前位置
	aboveLis.hover(function(){
		//鼠标悬停的当前位置
		var li = M(this);
		//当前列表项的索引
		var index = li.index();
		//当前位置的列表项的left值
		var left = li.left();
		//移动框移动到当前位置
		move.left(left+25);
		//鼠标悬停，图片的变化效果
		M(imgs.eq(index)).animate({mulAct:{height:130,width:170},speed:5});
	// 鼠标离开，移动框还保留在最后的位置，图片还原
	},function(){
		var li = M(this);
		var index = li.index();
		//还原图片
		M(imgs.eq(index)).animate({mulAct:{height:112,width:150},speed:5});
	});

	var total = aboveLis.length();
	//点击图片上层列表，弹出当前图片对应的大图窗口，锁屏
	aboveLis.click(function(){
		// 弹窗，居中
		box.show().center().lock();
		//锁屏
		screenLock(screen.eq(0));

		var li = M(this);
		//当前索引
		var index = li.index();
		//当前大图链接
		var src = li.attr('src');
		//加载当前大图，以及预加载左右两张大图
		preNext(src,index);
	});

	//点击关闭按钮，隐藏弹框，解除锁屏
	boxClose.click(function(){
		box.hide().unlock();
		screenUnlock(screen.eq(0));
	});

	//窗口重置，不让弹框移出屏幕，并重新锁屏
	window.onresize = function(){
		overRange(box.eq(0));
		//重新锁屏
		if(box.css('display') === 'block'){
			screenLock(screen.eq(0));
		}
	}
	//实现拖拽
	box.drag(head.eq(0));


	//鼠标移入大图左右两侧，实现左右箭头的显示效果
	//左箭头效果
	imgLeft.hover(function(){
		goLeft.animate({mulAct:{opacity:70},time:100});
	},function(){
		goLeft.animate({mulAct:{opacity:0}});
	});

	//右箭头效果
	imgRight.hover(function(){
		goRight.animate({mulAct:{opacity:70},time:100});
	},function(){
		goRight.animate({mulAct:{opacity:0}});
	});

	//点击大图左侧区域，加载上一张大图，并预加载该大图的左右两张大图
	imgLeft.click(function(){
		//当前图片索引
		var index = parseInt(bigImg.attr('index')) -1;
		index = index < 0 ? total - 1 : index;
		//当前大图链接
		var src = M(this).attr('src');
		//加载当前大图，并预加载左右两张大图
		preNext(src,index);
	});

	//点击大图右侧区域，加载下一张大图，并预加载该大图的左右两张大图
	imgRight.click(function(){
		//当前图片索引
		var index = parseInt(bigImg.attr('index')) + 1;
		index = index > total -1 ? 0 : index;
		//当前大图链接
		var src = M(this).attr('src');
		//加载当前大图，并预加载左右两张大图
		preNext(src,index);
	});

	/**
	 * 预加载实现函数
	 * @param  {[type]} src   [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	function preNext(src,index){
		//大图未加载成功以前，默认loading图片
		loading.show();
		//监听大图加载完毕后，显示大图，并隐藏loading
		var newImg = new Image();
		newImg.onload = function(){
			loading.hide();
			bigImg.attr('src',newImg.src).show();
		}
		newImg.src = src;

		//获取当前索引，对应前后两个索引
		var pre = previous(index, total);
		var nextNum = next(index, total);

		//根据前后索引获取左右大图链接
		var preSrc = aboveLis.eq(pre).getAttribute('src');
		var nextSrc = aboveLis.eq(nextNum).getAttribute('src');
		//保存当前索引
		bigImg.attr('index',index);
		//保存左右大图链接
		imgLeft.attr('src', preSrc);
		imgRight.attr('src', nextSrc);
	}
});

/**
 * ajax留言模块
 * @param  {[type]} ){	var user          [description]
 * @return {[type]}         [description]
 */
M(function(){
	//用户框
	var user = M('#user');
	// 邮箱框
	var email = M('#email');
	// 验证用户规则的正则表达式
	var uReg = /^[a-zA-Z_\u4e00-\u9fa5]{1}[\w\u4e00-\u9fa5]{1,5}$/;
	//验证邮箱格式的正则表达式
	var eReg = /^\w+@\w{2,5}(\.[a-z1-9]{2,4}){1,2}$/;
	//用户框的提示信息
	var uAlert = oneSelector('span',user.eq(0).parentNode);
	//邮箱框的提示信息
	var eAlert = oneSelector('span',email.eq(0).parentNode);

	//验证用户，邮箱，并根据验证结果进行提示
	validate(user, uAlert, uReg);
	validate(email, eAlert, eReg);

	//实现邮箱框下拉列表功能
	//下拉框
	var emailList = M('#email-list');
	//邮箱框的输入文本显示的位置
	var texts = M('#email-list .text');
	// 所有下拉列表选项
	var lis = M('#email-list li');
	//留言
	var content = M('#content');
	//留言的提示信息
	var spans = M('.total-word span');
	//计算输入个数的显示位置
	var counts = M('.total-word .count');
	//提交按钮
	var btn = M('#btn');
	//留言表单
	var form = M('#mes-form');
	//ajax取得的数据存放的位置
	var right = M('#message .right');

	//下来列表上下键盘选择，的初始选中位置
	var liIndex = 0;
	//所有下拉列表项的总长度
	var total = lis.length();
	//监听邮箱框的输入
	email.input(function(e){
		//得到输入的值
		var val = trim(this.value);
		//如果输入了@符号，隐藏下拉框
		if(/@/.test(val)){
			emailList.hide();
		//没有@符号就一直显示下拉框
		}else{
			emailList.show();
		}
		//将输入值显示到下来列表项中
		texts.html(val);
	});

	//监听邮箱框，键盘抬起事件
	email.keyup(function(e){
		//初始化下拉列表的选中状态
		lis.css('background','#fff').css('color','#666');
		M(lis.eq(liIndex)).css('background','#eee').css('color','#06f');
		//如果用户按了下箭头
		if(e.keyCode === 40){
			//得到下一个索引
			liIndex = next(liIndex, total);
		// 如果用户按了上箭头
		}else if(e.keyCode === 38){
			//得到上一个索引
			liIndex = previous(liIndex,total);
		}

		//再次更新下拉列表选中的状态
		var li = M(lis.eq(liIndex));
		lis.css('background','#fff').css('color','#666');
		li.css('background','#eee').css('color','#06f');
		//如果用户按了回车，将选中状态的值，替换为邮箱框的值，并隐藏下拉框，并还原初始值
		if(e.keyCode === 13){
			email.val(li.text());
			emailList.hide();
			liIndex = 0;
		}
	});

	//点击下拉列表，将点击的列表内容替换为邮箱框的值
	lis.mousedown(function(){
		email.val(M(this).text());
	});

	//设置鼠标在下拉框上移动的效果
	lis.mouseover(function(){
		lis.css('background','#fff').css('color','#666');
		M(this).css('background','#eee').css('color','#06f');
	});

	//当邮箱框失去焦点，隐藏下拉框
	email.blur(function(){
		emailList.hide();
	});

	//监听留言区域的输入
	content.input(function(){
		//得到输入的长度
		var len = trim(this.value).length;
		//得到还能输入的长度
		var diff = 200 -len;
		//当还能输入的长度小于0.即超过了
		if((diff) < 0){
			//隐藏初始状态
			spans.hide();
			//显示错误提示
			M(spans.eq(1)).show();
			//显示超过的值
			counts.eq(1).innerHTML = Math.abs(diff);
		//如果没有超过
		}else{
			// 隐藏初始状态
			spans.hide();
			//提示还能输入多少
			M(spans.eq(0)).show();
			//显示还能输入的长度
			counts.eq(0).innerHTML = diff;
		}
	});

	//ajax获取数据，并填充
	getMes(right);

	//点击提示按钮，验证输入信息，如果信息正确，提交到数据库，并更新留言
	btn.click(function(){
		//阻止表单自动提交
		form.submit(function(e){
			e.preventDefault();
		});

		//验证用户名
		if(!uReg.test(user.eq(0).value)){
			M(uAlert).hide();
			M(uAlert[2]).show();
			user.flag = 0;
		}else{
			user.flag = 1;
		}

		//验证邮箱
		if(!eReg.test(email.eq(0).value)){
			M(eAlert).hide();
			M(eAlert[2]).show();
			email.flag = 0;
		}else{
			email.flag = 1;
		}
		//验证留言内容
		var contentLen = content.eq(0).value.length;
		if(contentLen > 200){
			spans.hide();
			M(spans.eq(1)).show();
			content.flag = 0;
		}else if(contentLen === 0){
			spans.hide();
			M(spans.eq(2)).show();
			content.flag = 0;
		}else{
			content.flag = 1;
		}

		//如果验证成功了
		if(content.flag + email.flag + user.flag === 3){
			//得到用户输入的数据
			var data = createData(serialize(form.eq(0)));
			data += "&action=setMes";
			//ajax将数据提交到数据库
			ajax({
				url : 'index.php',
				data : data,
				method : 'post',
				scyn : true,
				fn : fn
			});

			function fn(text){
				var res = JSON.parse(text);
				// 如果数据库成功存储数据
				if(res === true){
					//更新留言列表
					getMes(right)
				}else{
					throw new Error('留言失败，数据没有成功存入数据库...');
				}
			}
		}
	});


	/**
	 * ajax获取数据并填充，函数封装
	 * @param  {[type]} right [description]
	 * @return {[type]}       [description]
	 */
	function getMes(right){
		ajax({
			url : 'index.php?action=getMes',
			data : null,
			method : 'get',
			scyn : true,
			fn : get
		});

		function get(text){
			right.html(text);
		}
	}

	/**
	 * 验证输入，并提示信息，函数封装
	 * @param  {[type]} obj    验证对象
	 * @param  {[type]} eAlert 提示信息
	 * @param  {[type]} reg    正则
	 * @return {[type]}        [description]
	 */
	function validate(obj,eAlert,reg){
		//提示信息的初始索引
		var eindex = 0;
		//提示信息
		var eBlank = M(eAlert[0]);
		var eInfo = M(eAlert[1]);
		var eDang = M(eAlert[2]);
		var eSucc = M(eAlert[3]);
		var meAlert = M(eAlert);

		//获取焦点，提示格式
		obj.focus(function(){
			meAlert.hide();
			eInfo.show();
		});

		//监听输入过程，并验证是否可用
		obj.input(function(){
			var val = trim(this.value);
			if(val.length === 0 ){
				meAlert.hide();
				eInfo.show();
				eindex = 0;
			}else if(reg.test(val)){
				meAlert.hide();
				eSucc.show();
				eindex = 3;
			}else{
				meAlert.hide();
				eBlank.show();
				eindex = 2;
			}
		});

		//失去焦点验证格式是正确
		obj.blur(function(){
			meAlert.hide();
			var val = trim(this.value);
			if(val.length === 0 ){
				eindex = 0;
			}else if(reg.test(val)){
				eindex = 3;
			}else{
				eindex = 2;
			}
			//显示最后的验证结果
			M(meAlert.eq(eindex)).show();
		});
	}
});

