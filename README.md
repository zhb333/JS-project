# 原生JavaScript编写特效网页    
    
    该项目基于个人编写的Base库，使用JS面向对象的方式开发；  
    Base库是在开发该项目时，从零编写而成；没有使用第三方类库。  
    从零到有，目的主要锻炼自身的编程能力；  
    由于精力有限，目前暂不兼容IE6、7、8；以后有时间再继续完善Base类库的兼容性；  

**该项目的演示网址：** [http://www.myphpcms.cn/js](http://www.myphpcms.cn/js)

|作者|邮箱|网站|  
|:---:|:---:|:---:  
|张焕标33|1140457303@qq.com|http://www.forapi.cn


## 功能介绍
* [动画导航](#动画导航)
* [换肤](#换肤)
* [banner轮播器](#banner轮播器)
* [拖拽&预加载](#拖拽&预加载)
* [Ajax留言板](#Ajax留言板)  

### 动画导航  

__思路__：导航列表***ul***用***z-index***分为三层：  
* 第一层为默认导航样式；
* 第二层为移动块，移动块中嵌套另一个实现动画的***ul***导航列表；
* 第三层为一个空的***ul***列表，只要依靠第三层实现动画效果；  

**功能**  
当鼠标移动到第三层的***ul***中具体的某个***li***,计算出当前***li***的***left***值，使用**Base**库编写的**animate**动画方法，实现将移动块缓冲移动到当前鼠标悬停的位置，当该动画执行完毕，队列执行将移动块中嵌套的***ul***反方向移动***left***位置；当鼠标离开时，移动块回到初始位置，就完成了想要的效果；  

__效果图：__  
![动画导航][nav]  

### 换肤 
__思路__： 换肤的***hover***功能基本于动画导航一样，只是鼠标离开后，移动框回到的位置不同，一个回到初始状态，一个回到选择皮肤的状态；点击某个皮肤，将***body***的背景图片更改为当前皮肤，并将背景颜色改为与皮肤相近的颜色

__功能：__ 换肤包括了三个效果：  
* 默认移动框在当前皮肤的位置，当重新选择皮肤，移动框定位到新皮肤位置；
* 鼠标移到某个皮肤上，移动框缓冲到当前位置，鼠标离开皮肤时，移动框回到选择的皮肤位置；
* 当点击选择某个皮肤时，改变网页背景，并更改移动框的位置  

**效果图**  
![换肤][skin]  

### banner轮播器  
**思路：**  轮播器分为左中右三部分:  
* 左侧为轮播导航，导航下有二级菜单，导航的二级菜单，突出显示块必须为一个整体，才能实现整体的移入移出效果，即***li***中包括了导航标题，突出块，二级菜单；
* 中间为轮播大图，实现轮播的思路：  
    * **手动** 当鼠标悬停在小圆点上，清除轮播的定时器，动画切换小圆点对应的大图，当鼠标离开时，重新开启定时器
    * **自动**  自动轮播的思路以及代码编写与手动及其类似，因此可以公用同一个方法，定时器自动执行该方法即可
* 右侧为轮播小图

__功能:__  
* 当鼠标移动到左侧轮播导航，鼠标悬停的导航突出显示，并渐入式显示该导航下的二级菜单；
* banner中间部分实现轮播大图片，使用个人独立封装banner实现方法，实现淡入淡出轮播效果
* banner右侧实现了图片左右切换效果，根据调用传入banner方法的类型值不同，实现不同的轮播效果    

**效果图**  
![banner轮播器][banner]   

### 拖拽&预加载

**思路&功能：** 该模块的实现分为两个功能：
1. 弹窗拖拽
    * **弹窗** 点击小图片，弹出显示大图片的窗口；
        * *思路* ： 点击小图后，将***display*** 为***none***的窗口该有***block***,并屏幕居中显示，同时锁屏，并隐藏滚动条，处理浏览器窗口改变，重新设置锁屏，并保证窗口在可视范围
    * **拖拽** 点击窗口的标题部分，可以实现拖拽，注意在拖拽的过程，窗口不能拖出屏幕范围，拖拽主要依靠三个事件：  
        * ***box.addEventListener('mousedown',fn,false)***
        * ***document.addEventListener('mousemove',move,false)***
        * ***document.addEventListener('mouseup',up,false)***
2. 预加载
    * 窗口显示点击的当前小图对应的大图，点击窗口的左右两边，可以实现上下图片的切换，而上下图片使用预加载进行处理
        - 思路：显示当前大图的同时，得到前后图片的索引，并根据该索引得到相对应的大图***src*** 值，并预先准备***new Image***对象加载前后图片
        * 点击前后图片切换，与点击小图显示大图的思路基本一样，可以使用同一个方法  

**效果图**：  
![拖拽&预加载][drag]  

### Ajax留言板  
**思路&功能：** 主要有两大功能：
* 表单验证
* Ajax提交&获取数据

**效果图：**
![Ajax留言板][mes]

- [x] 动画导航
- [x] 换肤
- [x] banner轮播器
- [x] 拖拽&预加载
- [x] Ajax留言板
> 我曰： 我执，是痛苦的根源！:blush:

[nav]:https://github.com/zhb333/JS-project/raw/master/readme/nav.jpg "动画导航"
[skin]:https://github.com/zhb333/JS-project/raw/master/readme/skin.jpg "换肤"
[banner]:https://github.com/zhb333/JS-project/raw/master/readme/banner.jpg "banner轮播器"
[drag]:https://github.com/zhb333/JS-project/raw/master/readme/drag.jpg "动画导航"
[mes]:https://github.com/zhb333/JS-project/raw/master/readme/mes.jpg "动画导航"
