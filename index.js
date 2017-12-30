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
		M(boxs.eq(index)).show().opacity(0).animate({mulAct:{opacity:100},time:60});
	},function(){
		//隐藏所有覆盖快
		covers.hide();
		//隐藏所有展示区域
		boxs.hide();
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


M(function(){
	var user = M('#user');
	var email = M('#email');
	var uReg = /^[a-zA-Z_\u4e00-\u9fa5]{1}[\w\u4e00-\u9fa5]{1,5}$/;
	var eReg = /^\w+@\w{2,5}(\.[a-z1-9]{2,4}){1,2}$/;
	var uAlert = oneSelector('span',user.eq(0).parentNode);
	var eAlert = oneSelector('span',email.eq(0).parentNode);
	validate(user, uAlert, uReg);
	validate(email, eAlert, eReg);

	var emailList = M('#email-list');
	var texts = M('#email-list .text');
	var lis = M('#email-list li');
	var content = M('#content');
	var spans = M('.total-word span');
	var counts = M('.total-word .count');
	var btn = M('#btn');
	var form = M('#mes-form');
	var right = M('#message .right');

	var liIndex = 0;
	var total = lis.length();
	email.input(function(e){
		var val = trim(this.value);
		if(/@/.test(val)){
			emailList.hide();
		}else{
			emailList.show();
		}
		texts.html(val);
	});

	email.keyup(function(e){
		lis.css('background','#fff').css('color','#666');
		M(lis.eq(liIndex)).css('background','#eee').css('color','#06f');
		if(e.keyCode === 40){
			liIndex = next(liIndex, total);
		}else if(e.keyCode === 38){
			liIndex = previous(liIndex,total);
		}

		var li = M(lis.eq(liIndex));
		lis.css('background','#fff').css('color','#666');
		li.css('background','#eee').css('color','#06f');
		if(e.keyCode === 13){
			email.val(li.text());
			emailList.hide();
			liIndex = 0;
		}
	});

	lis.mousedown(function(){
		email.val(M(this).text());
	});

	lis.mouseover(function(){
		lis.css('background','#fff').css('color','#666');
		M(this).css('background','#eee').css('color','#06f');
	});


	email.blur(function(){
		emailList.hide();
	});


	content.input(function(){
		var len = trim(this.value).length;
		var diff = 200 -len;
		if((diff) < 0){
			spans.hide();
			M(spans.eq(1)).show();
			counts.eq(1).innerHTML = Math.abs(diff);
		}else{
			spans.hide();
			M(spans.eq(0)).show();
			counts.eq(0).innerHTML = diff;
		}
	});
	getMes(right);
	btn.click(function(){
		form.submit(function(e){
			e.preventDefault();
		});

		if(!uReg.test(user.eq(0).value)){
			M(uAlert).hide();
			M(uAlert[2]).show();
			user.flag = 0;
		}else{
			user.flag = 1;
		}

		if(!eReg.test(email.eq(0).value)){
			M(eAlert).hide();
			M(eAlert[2]).show();
			email.flag = 0;
		}else{
			email.flag = 1;
		}
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

		if(content.flag + email.flag + user.flag === 3){
			var data = createData(serialize(form.eq(0)));
			data += "&action=setMes";
			ajax({
				url : 'index.php',
				data : data,
				method : 'post',
				scyn : true,
				fn : fn
			});

			function fn(text){
				var res = JSON.parse(text);
				if(res === true){
					getMes(right)
				}else{
					throw new Error('留言失败，数据没有成功存入数据库...');
				}
			}
		}
	});

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

	function validate(obj,eAlert,reg){
		var eindex = 0;
		
		var eBlank = M(eAlert[0]);
		var eInfo = M(eAlert[1]);
		var eDang = M(eAlert[2]);
		var eSucc = M(eAlert[3]);
		var meAlert = M(eAlert);
		obj.focus(function(){
			meAlert.hide();
			eInfo.show();
		});


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
			M(meAlert.eq(eindex)).show();
		});
	}
});

