# drag       
html dom draggable. it supports ie5+, chrome, firefox, safire, opera etc.           
          
# options          
       
## isLock         
是否可以拖动，默认false，可以拖动       
       
## container       
拖动元素的容器       
       
## targets       
触发拖动的元素，默认值是绑定元素       
       
## onlyX       
是否只允许x轴拖动，默认false       
       
## onlyY       
是否只允许y轴拖动，默认false       
       
## Limit       
是否有限制，默认false，没有限制。       
       
##  minLeft          
距离左侧移动最小距离，只有当Limit为true时才生效       
       
##  minRight          
距离右侧移动最小距离，只有当Limit为true时才生效       
       
##  minTop          
距离顶部移动最小距离，只有当Limit为true时才生效       
       
##  minBottom          
距离底部移动最小距离，只有当Limit为true时才生效       
       
## onStart       
当元素开始移动时执行， function       
       
## onMove       
当元素移动时执行，function       
       
## onStop       
当元素移动停止时执行，function       
       
# method       
       
## setLock       
锁定可移动元素       
       
## releaseLock       
解除锁定       
       
## getPositions       
获取元素的移动位置，返回{left, top}       
       
       
# Example       
```       
var drag = new Drag("test", {       
	onStart: function(){       
       
	},       
	onMove: function(){       
		document.getElementById('position').innerHTML = '距离左边：' + drag.getPositions().left + '；距离顶部：' + drag.getPositions().top;    
	},   
	onStop: function(){   
   
	}   
});   
```    
   
