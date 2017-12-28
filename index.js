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

	//点击图片上层列表，弹出当前图片对应的大图窗口，锁屏
	aboveLis.click(function(){
		box.show().center().lock();
		screenLock(screen.eq(0));
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
	box.drag();
});

