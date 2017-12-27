M(function(){
	var aboveLis = M('#nav-above li');
	var navMove = M('#nav-move');
	var navWhite = M('#nav-white');
	aboveLis.hover(function(){
		var left = M(this).left();
		navMove.animate({mulAct : {left : 20 + left}, fn : function(){
			navWhite.animate({mulAct : {left : -left}});
		}});
	},function(){
		navMove.animate({mulAct : {left : 20}, fn : function(){
			navWhite.animate({mulAct : {left : 0}});
		}});
	});
});