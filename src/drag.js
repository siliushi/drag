/**
 * HTML DOM DRAGGABLE
 * @date   2016-03-20
 * @author ganzwen@gmail.com
 * @site   https://github.com/baixuexiyang/drag.git
 */
;(function (name, fun) {
    if(typeof module !== 'undefined' && module.exports) {
        module.exports = fun();
    } else if(typeof define === 'function' && define.amd) {
        define(fun);   
    }else {
        this[name] = fun();
    }
})('Drag', function () {
    "use strict";
    var isIE = /msie/.test(navigator.userAgent.toLowerCase());
    var Bind = function(object, fun) {
    	return function() {
    		return fun.apply(object, arguments);
    	};
    };
    var Css = function(element, styles) {
    	for(var _k in styles) {
    		element.style[_k] = styles[_k];
    	}
    	return element;
    };

    var BindAsEventListener = function(object, fun) {
    	return function(event) {
    		return fun.call(object, (event || window.event));
    	};
    };

    var CurrentStyle = function(element){
    	return element.currentStyle || document.defaultView.getComputedStyle(element, null);
    };

    var addEventHandler = function(oTarget, sEventType, fnHandler) {
    	if (oTarget.addEventListener) {
    		oTarget.addEventListener(sEventType, fnHandler, false);
    	} else if (oTarget.attachEvent) {
    		oTarget.attachEvent("on" + sEventType, fnHandler);
    	} else {
    		oTarget["on" + sEventType] = fnHandler;
    	}
    };

    var removeEventHandler = function(oTarget, sEventType, fnHandler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, false);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent("on" + sEventType, fnHandler);
        } else { 
            oTarget["on" + sEventType] = null;
        }
    };

	var Drag = function(drag, options) {
		this.Drag = document.getElementById(drag);
		this._x = this._y = 0;
		this._marginLeft = this._marginTop = 0;
		//事件对象(用于绑定移除事件)
		this._fM = BindAsEventListener(this, this.Move);
		this._fS = Bind(this, this.Stop);
		this.SetOptions(options);
		this.Limit = !!this.options.Limit;
		this.minLeft = parseInt(this.options.minLeft);
		this.minRight = parseInt(this.options.minRight);
		this.minTop = parseInt(this.options.minTop);
		this.minBottom = parseInt(this.options.minBottom);
		this.onlyY = !!this.options.onlyY;
		this.onlyX = !!this.options.onlyX;
		this.isLock = !!this.options.isLock;
		this.onStart = this.options.onStart;
		this.onMove = this.options.onMove;
		this.onStop = this.options.onStop;
		this._Handler = document.getElementById(this.options.targets) || this.Drag;
		this._container = document.getElementById(this.options.container) || null;

		if(this._container) {
			Css(this._container, {
				position: 'relative',
				overflow: 'hidden'
			});
		}
		if(this.Drag) {
			Css(this.Drag, {
				position: 'absolute',
				top: 0,
				left: 0,
				cursor: 'move'
			});
		}
		if(isIE && !!this.options.Transparent){
			this._Handler.appendChild(Css(document.createElement("div"), {
				width: '100%',
				height: "100%",
				backgroundColor: "#fff",
				filter: "alpha(opacity:0)",
				fontSize: 0
			}));
		}
		//修正范围
		this.Repair();
		addEventHandler(this._Handler, "mousedown", BindAsEventListener(this, this.Start));
	};
	Drag.prototype = {
		SetOptions: function(options) {
			options = options || {};
			this.options = {
				targets:			"",     //设置触发对象（不设置则使用拖放对象）
				Limit:			false,      //是否设置范围限制(为true时下面参数有用,可以是负数)
				minLeft:		0,          //左边限制
				minRight:		99999,      //右边限制
				minTop:			0,          //上边限制
				minBottom:		99999,      //下边限制
				container:	    "",         //指定限制在容器内
				onlyY:			false,      //是否锁定水平方向拖放
				onlyX:			false,      //是否锁定垂直方向拖放
				isLock:         false,      //是否锁定
				Transparent:	true,      //是否透明
				onStart:		function(){},//开始移动时执行
				onMove:			function(){},//移动时执行
				onStop:			function(){}//结束移动时执行
			};
			for (var _k in options) {
				this.options[_k] = options[_k];
			}
		},
		setLock: function() {
			this.isLock = true;
		},
		releaseLock: function() {
			this.isLock = false;
		},
		getPositions: function() {
			return {
				left: this.Drag.offsetLeft,
				top: this.Drag.offsetTop
			};
		},
		Start: function(oEvent) {
			if(this.isLock){
				return;
			}
			this.Repair();
			//记录鼠标相对拖放对象的位置
			this._x = oEvent.clientX - this.Drag.offsetLeft;
			this._y = oEvent.clientY - this.Drag.offsetTop;
			//记录margin
			this._marginLeft = parseInt(CurrentStyle(this.Drag).marginLeft) || 0;
			this._marginTop = parseInt(CurrentStyle(this.Drag).marginTop) || 0;
			//mousemove时移动 mouseup时停止
			addEventHandler(document, "mousemove", this._fM);
			addEventHandler(document, "mouseup", this._fS);
			if(isIE){
				//焦点丢失
				addEventHandler(this._Handler, "losecapture", this._fS);
				//设置鼠标捕获
				this._Handler.setCapture();
			}else{
				//焦点丢失
				addEventHandler(window, "blur", this._fS);
				//阻止默认动作
				oEvent.preventDefault();
			}
			//附加程序
			this.onStart();
		},
		//修正范围
		Repair: function() {
			if(this.Limit){
				//修正错误范围参数
				this.minRight = Math.max(this.minRight, this.minLeft + this.Drag.offsetWidth);
				this.minBottom = Math.max(this.minBottom, this.minTop + this.Drag.offsetHeight);
				//如果有容器必须设置position为relative或absolute来相对或绝对定位，并在获取offset之前设置
				!this._container || CurrentStyle(this._container).position == "relative" || CurrentStyle(this._container).position == "absolute" || (this._container.style.position = "relative");
			}
		},
		//拖动
		Move: function(oEvent) {
			//是否允许拖动
			if(this.isLock){
				this.Stop();
				return;
			}
			//清除选择
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			//设置移动参数
			var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY - this._y;
			//设置范围限制
			if(this.Limit){
				//设置范围参数
				var minLeft = this.minLeft,
					minRight = this.minRight,
					minTop = this.minTop,
					minBottom = this.minBottom;
				//如果设置了容器，再修正范围参数
				if(!!this._container){
					minLeft = Math.max(minLeft, 0);
					minTop = Math.max(minTop, 0);
					minRight = Math.min(minRight, this._container.clientWidth);
					minBottom = Math.min(minBottom, this._container.clientHeight);
				}
				//修正移动参数
				iLeft = Math.max(Math.min(iLeft, minRight - this.Drag.offsetWidth), minLeft);
				iTop = Math.max(Math.min(iTop, minBottom - this.Drag.offsetHeight), minTop);
			}
			//设置位置，并修正margin
			if(!this.onlyY) {
				this.Drag.style.left = iLeft - this._marginLeft + "px";
			}
			if(!this.onlyX) {
				this.Drag.style.top = iTop - this._marginTop + "px";
			}
			this.onMove();
		},
		Stop: function() {
			removeEventHandler(document, "mousemove", this._fM);
			removeEventHandler(document, "mouseup", this._fS);
			if(isIE){
				removeEventHandler(this._Handler, "losecapture", this._fS);
				this._Handler.releaseCapture();
			}else{
				removeEventHandler(window, "blur", this._fS);
			}
			this.onStop();
		}
	};
    return Drag;
});
