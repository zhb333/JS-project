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
	// 皮肤列表
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

M(function(){
	var lis = M('#banner-left li');
	var lisOne = lis.elements[0];
	var lisOneH = lisOne.offsetHeight;
	var lisOneMB = parseInt(getCss(lisOne, 'marginBottom'));
	var covers = M('.banner-cover');
	var coverNodes = covers.getNodes();
	var coverFirstT = parseInt(getCss(coverNodes[0], 'top'));
	var coverSingleT = lisOneH + lisOneMB;
	var boxs = M('.banner-box');
	for(var i = 0; i < coverNodes.length; i++){
		var coverNode = coverNodes[i];
		coverNode.style.top = coverFirstT + i * coverSingleT + 'px';
	}


	lis.hover(function(){
		var index = M(this).index();
		M(coverNodes[index]).show();
		M(boxs.eq(index)).show();
	},function(){
		covers.hide();
		boxs.hide();
	});





});