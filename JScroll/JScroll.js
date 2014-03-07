/**
* @jScroll JavaScript Library v1.0.4
* @author hevia hui <weibo : http://weibo.com/210009226>
* @copyright 2013
*
* Date: 2013-08-13T16:44Z
*/
(function(){
var
	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	strundefined = typeof undefined,
	document = window.document,
	docElem = document.documentElement,
	version = "1.5",
	
	browser = function(){
		var agent = navigator.userAgent.toLowerCase(),
		opera = window.opera,
		browser = {
			/**
			* 检测浏览器是否为IE
			* @name ie
			* @grammar UE.browser.ie  => true|false
			*/
			ie		: !!window.ActiveXObject,
			opera	: ( !!opera && opera.version ),
			/**
			* 检测浏览器是否为webkit内核
			* @name webkit
			* @grammar UE.browser.webkit  => true|false
			*/
			webkit	: ( agent.indexOf( ' applewebkit/' ) > -1 ),
			/**
			* 检测浏览器是否为mac系统下的浏览器
			* @name mac
			* @grammar UE.browser.mac  => true|false
			*/
			mac	: ( agent.indexOf( 'macintosh' ) > -1 ),
			/**
			* 检测浏览器是否处于怪异模式
			* @name quirks
			* @grammar UE.browser.quirks  => true|false
			*/
			quirks : ( document.compatMode == 'BackCompat' )
		};
		browser.gecko =( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );
		if (/chrome\/(\d+\.\d)/i.test(agent)) {
			browser.chrome = + RegExp['\x241'];
		}
		/**
		 * 检测浏览器是否为safari
		 * @name safari
		 * @grammar     UE.browser.safari  => true|false
		 */
		if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)){
			browser.safari = + (RegExp['\x241'] || RegExp['\x242']);
		};
		return browser;
	}(),
	//默认参数
	defaults = {
		width:"10",
		handerColor:"#eaeaea",
		handerOverColor:false,
		handerDownColor:false,
		barColor:"#999a9a",
		barImage:"",
		handerImage:"",
		barRadius:10,
		margin:'2px',
		border:1,
		borderColor:'#ccc',
		resize:true,
		zIndex:9999,
		minOpacity:0.6,
		middleOpacity:0.7,
		maxOpacity:1,
		wheelparam:7,
		wheelFn:null,
		scrollFn:null
	},
	jScroll = function(dom,arg,container,helps){
		var set = jScroll.extend(defaults,arg),
			childNode = dom,
			parentNode = container?container:dom.parentNode ,
			showScrollBar = false,
			fun = {};
		helper = {};
		helper = jScroll.extend(helper,helps);
		//必要计算参数
		var handerTopCp = 0,pNborderWidth,barHeight,handerHeight,deltaMouse = 0;
		//定时器参数
		var mousewheelDelay,ani ;

		fun.elementStyle = function(element,styleisObject){
			var elStyle = element.style ; 
			for(var i in styleisObject){
				var _style = ( i =='float')?((browser.ie)?'styleFloat':'cssFloat'):i;
				elStyle[_style] = styleisObject[i] ; 
			}
		};
		//滚动条初始化
		fun.init = function(){
			
			_csspadding =  jScroll.getStyle(parentNode,'padding');
			pNpadding = _csspadding == ''?0:parseInt(_csspadding);
			childNodeHeight = childNode.offsetHeight+2*pNpadding;
			parentNodeHeight = parentNode.offsetHeight;
			var _cssBorderWidth = jScroll.getStyle(parentNode,'borderWidth');
			pNborderWidth = _cssBorderWidth == ''?0:parseInt(_cssBorderWidth);
			pNborderWidth =(isNaN(pNborderWidth))?0:pNborderWidth;
			//内容不高于容器时，不加载滚动条	
			if(childNodeHeight<=parentNodeHeight) return ;
			showScrollBar = true ;
			haveScrollBar = jScroll.getClassDom('scrollBar',parentNode).length>0?true:false;
			if(!haveScrollBar){
				jScroll.createDom.append('<div class="scrollBar"><span class="scrollBar_hander"></span></div>',parentNode);
			}
			var scrBar = jScroll.getClassDom('scrollBar',parentNode)[0],
				hander = jScroll.getClassDom('scrollBar_hander',parentNode)[0];
				barHeight = parentNodeHeight - set.border * 2 - pNborderWidth*2 - parseInt(set.margin)*2;
				handerHeight = barHeight*parentNodeHeight/childNodeHeight ; 
			//添加滚动条
			fun.elementStyle(scrBar,{
				'width':set.width +'px',
				'height':barHeight +'px',
				'position':'absolute',
				'border':set.border +'px solid '+set.borderColor,
				'borderRadius':set.barRadius +'px',
				'background':'url('+set.barImage+') '+set.barColor+' no-repeat',
				'right':0, 
				'top':0,
				'zIndex':set.zIndex,
				'display':'block',
				'margin':set.margin,
				'opacity':set.minOpacity
			});
			fun.elementStyle(hander,{
				'top':0,
				'position':'relative',
				'right':0,
				'width':set.width +'px',
				'height':handerHeight +'px',
				'display':'block',
				'borderRadius':set.barRadius +'px',
				'background':'url('+set.handerImage+') '+set.handerColor+' no-repeat',
				'margin':'0px 0px 0px 0px',
				'cursor':'pointer'
			});
		};
		fun.reInit = function(){
			fun.init();
			jScroll.getClassDom('scrollBar_hander',parentNode)[0].style.top = -deltaMouse*set.wheelparam +'px';
		};
		fun.init();
		if(helper.reset) {
			helper.reset(function(){
				fun.reInit();
			})
		}
		//窗口大小变化事件
		//set.resize = false时不执行
		fun.resize = function(){
			if(!set.resize) return ;
			jScroll.Event._add(window,'resize',function(){
				childNodeHeight = childNode.offsetHeight+2*pNpadding,
				parentNodeHeight = parentNode.offsetHeight;
				var elements = {};
				if(childNodeHeight<=parentNodeHeight) {
					if(showScrollBar){
						var node = jScroll.getClassDom('scrollBar',parentNode)[0] ;
						if(node) {node.parentNode.removeChild(node);}
						elements = {};
						showScrollBar = false ;
					}
				}else{
					if(showScrollBar){	
						elements['Bar'] = jScroll.getClassDom('scrollBar',parentNode)[0],
						elements['hander'] = jScroll.getClassDom('scrollBar_hander',parentNode)[0];
		 				elements['Bar'].style.height = parentNodeHeight- set.border * 2- pNborderWidth*2 - parseInt(set.margin)*2+'px' ;//滚动条高度根据窗口高度改变
						barHeight = elements['Bar'].offsetHeight ; 
						handerHeight = barHeight*parentNodeHeight/childNodeHeight ; 
		 				fun.elementStyle(elements['hander'],{
		 					height : handerHeight+'px',
		 					top : handerTopCp*parentNodeHeight+'px'
		 				});
						handerHeight = elements['hander'].offsetHeight ;//变化后新滚动条高度参数
						barTop = elements['Bar'].offsetTop,/*19*/  
						handerTop = elements['hander'].offsetTop ;/*20*/

						if(handerTop-barTop+handerHeight>=barHeight){
							elements['hander'].style.top = barHeight-handerHeight +'px';
							// alert((handerHeight-barHeight)/barHeight*childNodeHeight)
							childNode.style.top = (handerHeight-barHeight)/barHeight*childNodeHeight +'px';
						}
						deltaMouse=(barTop-handerTop+1)/set.wheelparam;
					}else{
						fun.init();
						elements['Bar'] = jScroll.getClassDom('scrollBar',parentNode)[0],
						elements['hander'] = jScroll.getClassDom('scrollBar_hander',parentNode)[0];
						fun.mouse();
					}
				} ;
			})
		}();
		//获取鼠标坐标
		fun.mousePos = function(e){
			var x,y;
			//var e = e||window.event;

			return {
				x:e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
				y:e.clientY+document.body.scrollTop+document.documentElement.scrollTop
			};
		};
		//根据滚动条位置控制内容层位置
		fun.barCtrlcontent = function(){
			var scrBar = jScroll.getClassDom('scrollBar',parentNode)[0],
				hander = jScroll.getClassDom('scrollBar_hander',parentNode)[0];
			var _top = hander.offsetTop-scrBar.offsetTop+parseInt(set.margin);
			deltaMouse = -_top/set.wheelparam;
			var _thisTop = _top*(childNodeHeight-parentNodeHeight)/(barHeight-handerHeight);
			childNode.style.top =- _thisTop +'px';
		};
		
		fun.animateOpacity = function(obj,a,b){
			clearInterval(ani);
			var abs = (a-b>0)?1:-1;
			opacity = a;
			ani = setInterval(function(){
				if(abs==1&&opacity>=b){
					opacity-=0.01;
					obj.style.opacity = opacity;
				}else if(abs==-1&&opacity<=b){
					opacity+=0.01;
					obj.style.opacity = opacity;
				}else{
					clearInterval(ani);
				}
			},1)
		};
		//鼠标事件
		fun.mouse = function(){
			var scrBar = jScroll.getClassDom('scrollBar',parentNode)[0],
				hander = jScroll.getClassDom('scrollBar_hander',parentNode)[0];
			if(!scrBar) return ;
			var 
				barTop = scrBar.offsetTop,
				handerTop =  hander.offsetTop,
				barHeight = scrBar.offsetHeight,
				handerHeight = hander.offsetHeight,
				arg = {
					y:0,
					_y:0,
					slip:false,
					over:false,
					animate:undefined
				};
			var 
				del_add_event = function(dom,type,Fn){
					jScroll.Event._del(dom,type,Fn);	
					jScroll.Event._add(dom,type,Fn);	
				},
				/**
				 * 滚动条mousedown事件函数
				 * @name downFn 
				 */
				downFn = function(e){
					
					
					var e = e || window.event;
					var self = e.target?e.target:e.srcElement;
					
					if(self==hander){ ;
						arg.slip = true;
						handerTop = hander.offsetTop ;
						barTop = scrBar.offsetTop ;
						if(set.handerDownColor){
							hander.style.backgroundColor = set.handerDownColor;
						};
						if(set.handerOverColor){
							jScroll.Event._del(hander,'mouseout',handerOutFn);
							jScroll.Event._del(hander,'mouseover',handerOverFn);
						};
						
						arg._y = fun.mousePos(e).y - handerTop;//小条条的相对坐标Y
						del_add_event(document,'mousemove',moveFn);	

					}else{
						if (document.documentElement.getBoundingClientRect) { 
							clearInterval(arg.animate);
						 	handerHeight  = hander.offsetHeight ;
							barHeight = scrBar.offsetHeight ;
							var ny = fun.mousePos(e).y ;
							arg.animate = setInterval(function(){
					            var _y = hander.getBoundingClientRect().top  + document.documentElement.scrollTop ,
					            	barTop = scrBar.getBoundingClientRect().top+ document.documentElement.scrollTop ,
					            	dif = _y-barTop-set.border;
				            	if(_y > ny){
				            		dif = dif -1*set.wheelparam;
					        	}else if(_y + handerHeight < ny){		        		
					        		dif = dif +1*set.wheelparam;
					        	}else{
					        		clearInterval(arg.animate);
					        	}
					        	if(dif<=0){dif = 0;}
								if(dif>=barHeight - handerHeight ){dif= barHeight - handerHeight  ;}
					        	hander.style.top = dif +'px';
					        	fun.barCtrlcontent();
					        	handerTop =  hander.offsetTop ;
					        	handerTopCp=((handerTop-scrBar.offsetTop-set.border)/barHeight);
				            },1)
			        	}
			    	};
			    	jScroll.Event._del(scrBar,'mouseout',isBarOutFn);
			    	//jScroll.Event._del(parentNode,'mouseout',pNoutFn);
			    	jScroll.stopDefault(e);
				},
				/**
				 * 滚动条mousemove事件函数
				 * @name moveFn 
				 */
				moveFn = function(e){
					//e.preventDefault();
					arg.y = fun.mousePos(e).y - barTop;//滚动条相对坐标Y

					if(arg.slip){
						var dif = arg.y - arg._y;
						childNodeHeight = childNode.offsetHeight+2*pNpadding,
						parentNodeHeight = parentNode.offsetHeight;
						barHeight = scrBar.offsetHeight -2*set.border; 
						handerHeight = hander.offsetHeight;
						hander.style.top = dif +'px';
						if(dif<0){hander.style.top = 0;if(helper.totop) {helper.totop(function(){fun.reInit();},function(){fun.totop = null;});}};
						if(dif>barHeight-handerHeight){hander.style.top = barHeight-handerHeight +'px';if(helper.toend) {helper.toend(function(){fun.reInit();},function(){fun.toend = null;});}};
						fun.barCtrlcontent();
						if(set.scrollFn!=null){set.scrollFn();}
					}
					handerTopCp=((handerTop-scrBar.offsetTop-set.border)/barHeight);
				},
				/**
				 * 滚动条mouseup事件函数
				 * @name upFn 
				 */
				upFn = function (e){
					arg.slip = false;
					handerTop = hander.offsetTop ;
					if(set.handerDownColor){
						hander.style.backgroundColor = set.handerColor;
						jScroll.Event._add(hander,'mouseover',handerOverFn);
					};
					var dom =e.target?e.target:e.srcElement;
					if(dom!=scrBar&&dom!=hander){
						_opacity =(arg.over)?set.middleOpacity:set.minOpacity;
						fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),_opacity);
					};
					jScroll.Event._add(scrBar,'mouseout',isBarOutFn);
					clearInterval(arg.animate);
					return false;
				},
				/**
				 * 滚动条mouseover事件函数
				 * @name handerOverFn 
				 */
				handerOverFn = function(e){
					if(set.handerOverColor){
						hander.style.backgroundColor = set.handerOverColor;
						del_add_event(hander,'mouseout',handerOutFn);
					};
				},
				/**
				 * 滚动条mouseout事件函数
				 * @name handerOutFn 
				 */
				handerOutFn = function(e){
	 				hander.style.backgroundColor = set.handerColor;
				},
				barOverFn = function(e){
					fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),set.maxOpacity);
				},
				barOutFn = function(e){
					fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),set.middleOpacity);
				},
				isBarOverFn = function(e){
					jScroll.isthisDom(e,scrBar,barOverFn);
				},
				isBarOutFn = function(e){
					jScroll.isthisDom(e,scrBar,barOutFn);
				},
				domOverFn = function(){
					fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),set.middleOpacity);
				},
				domOutFn = function(){
					fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),set.minOpacity);
					jScroll.Event._del(hander,'mouseout',handerOutFn);
					jScroll.Event._del(scrBar,'mouseout',isBarOutFn);
					clearTimeout(mousewheelDelay);
				},

				pNoverFn = function(e){
					jScroll.isthisDom(e,parentNode,domOverFn);
					if(!arg.slip){
						del_add_event(parentNode,'mouseout',pNoutFn);
					};
					arg.over=true;
				},
				pNoutFn = function(e){
					if(!arg.slip){
						jScroll.isthisDom(e,parentNode,domOutFn);
					}
					arg.over=false;
				}
				;
			del_add_event(parentNode,'mouseover',pNoverFn);
			del_add_event(parentNode,'mouseout',pNoutFn);
			del_add_event(scrBar,'mousedown',downFn);
			del_add_event(document,'mouseup',upFn);
			del_add_event(scrBar,'mouseout',barOutFn);
			del_add_event(hander,'mouseover',handerOverFn);
			del_add_event(scrBar,'mouseover',barOverFn);

		
		};
		fun.mouse();
		//绑定滚轮事件
		
		jScroll.fn.mousewheel(parentNode,function(){
			clearTimeout(mousewheelDelay);
			if(!showScrollBar) return ;
			childNodeHeight = childNode.offsetHeight+2*pNpadding,
			parentNodeHeight = parentNode.offsetHeight;
			var scrBar = jScroll.getClassDom('scrollBar',parentNode)[0],
				hander = jScroll.getClassDom('scrollBar_hander',parentNode)[0];
			barHeight = scrBar.offsetHeight -2*set.border; 
			handerHeight = hander.offsetHeight;
			handerTop = hander.offsetTop;
			var i = 0;
			if(delta>0){i++;}
			else if(delta<0){i--;}
			deltaMouse = i + deltaMouse;
			if(-deltaMouse<0){deltaMouse = 0;if(helper.totop){helper.totop(function(){fun.reInit();},function(){helper.totop = null;});}};
			if(-deltaMouse*set.wheelparam>barHeight-handerHeight){deltaMouse=(handerHeight-barHeight)/set.wheelparam;if(helper.toend){helper.toend(function(){fun.reInit();},function(){helper.toend = null;});}}
			hander.style.top = -deltaMouse*set.wheelparam +'px';
			var _thisTop = (-deltaMouse*set.wheelparam)*(childNodeHeight-parentNodeHeight)/(barHeight-handerHeight);
			childNode.style.top = -_thisTop +'px';
			handerTopCp=((handerTop-scrBar.offsetTop-set.border)/barHeight);
			fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),set.maxOpacity);
			mousewheelDelay = setTimeout(function(){
				fun.animateOpacity(scrBar,parseFloat(scrBar.style.opacity),set.middleOpacity);
				clearTimeout(mousewheelDelay);
			},1000);
			if(set.wheelFn!=null){set.wheelFn()}
		})
	};
	
	jScroll.fn = jScroll.prototype = {
		mousewheel:function(obj,Func){
			var objType = typeof obj ; 
			function addEvent(self){
				delta = 0;//滚动方向
				if(browser.ie||browser.safari||browser.chrome){
				   self.onmousewheel=function(){ delta = event.wheelDelta;event.returnValue = false;Func && Func.call(self);};
				}else{
				   self.addEventListener("DOMMouseScroll",function(e){
						delta = e.detail>0?-1:1;
						jScroll.stopDefault(e);
						Func && Func.call(self);
				   },false); 
				}
			};
			if(objType === 'array'){
				for(var i = 0 ,l = obj.length; i < l;i++){
					addEvent(obj[i])
				}
			}else if(objType === 'object'){
				addEvent(obj)
			}
			return obj;
		}
	};
	/**
	 * 在domElement下以class获取dom对象
	 * @name getClassDom 
	 * @grammar   getClassDom(class,parentNode) => dom  
	 */

	jScroll.getClassDom = jScroll.prototype.getClassDom = function(className,domElement){
		if(!domElement) domElement = window.document ;
		var classElements = [],
			allElements = domElement.getElementsByTagName('*');
		for (var i=0; i< allElements.length; i++ ){
			var reg=/\w \w/g;
	        if(allElements[i].className.length!=0){
	            var arr=new Array();
	            if(allElements[i].className.match(reg)!=null){
	                var arr=allElements[i].className.split(" ");
	                for(var j in arr){
	                    if (arr[j] === className ) {    
	                        classElements[classElements.length] = allElements[i];
	                    }
	                }
	            }else{
	                if (allElements[i].className === className ) {
	                    classElements[classElements.length] = allElements[i];
	                }
	            }
	        }
	    }
	    return classElements;
	};
	//参数修正
	jScroll.extend = jScroll.prototype.extend = function(defaultObj,set){
		var _default = defaultObj;
		for(var i in set){
			_default[i] = set[i];
		}
		return _default;
	};

	//添加对象
	jScroll.createDom = jScroll.prototype.createDom = {
	/**
	 * html change to domElement
	 * @param html {string} 
	 * @return {object} domElement.
	 */
		createElementByHtml:function(html){
			var temp = document.createElement('div');
		    temp.innerHTML = html;
		    var tempArr = [];
		    for(var i = 0 , l = temp.childNodes.length;i<l;i++){
		    	tempChild = temp.firstChild;
		    	tempArr[i] = tempChild;
		    	temp.removeChild(tempChild);
		    }
		    return tempArr;
		},
		append :function(html,parentNode){
			nodeArr = jScroll.createDom.createElementByHtml(html);
			for(var i = 0 , l = nodeArr.length; i < l ; i++){
				parentNode.appendChild(nodeArr[i]);
			}
		},
		prepent :function(html,parentNode){
			function prependChild(parent,newChild){
			    if(parent.firstChild){
			        parent.insertBefore(newChild,parent.firstChild);
			    } else {
			        parent.appendChild(newChild);
			    }
		    	return parent;
			}
			nodeArr = jScroll.createDom.createElementByHtml(html);
			for(var i = 0 , l = nodeArr.length; i < l ; i++){
				parentNode.prependChild(parentNode,nodeArr[l-i-1])
			}
		}
	};
	/**
	 * get element style.
	 * @param1 elem {object[object HTMLDocument]} 
	 * @param2 styleName {string}
	 * @return {string} style.value.
	 */
	jScroll.getStyle = jScroll.prototype.getStyle = function(elem,styleName){
        if(elem.style[styleName]){//内联样式
            return elem.style[styleName];
        }
        else if(elem.currentStyle){//IE
            return elem.currentStyle[styleName];
        }
        else if(document.defaultView && document.defaultView.getComputedStyle){//DOM
            styleName = styleName.replace(/([A-Z])/g,'-$1').toLowerCase();
            var s = document.defaultView.getComputedStyle(elem,'');
            return s&&s.getPropertyValue(styleName);
        }
        else{//other,for example, Safari
            return null;
        }
	};
	

	jScroll.Event = jScroll.prototype.Event = {
	/**
	 * @function _add 对象事件监听
	 * 	@param1 obj {object} [事件对象] 
	 * 	@param2 type {string} [事件 ]
	 * 	@param3 type {function} [回调函数]
	 * 	@return {boolean} => true||false.
	 */
		_add : function(obj,type,fun){
			if(obj.addEventListener){
				obj.addEventListener(type,fun,false);
				return true;
			}else if(obj.attachEvent){
				return obj.attachEvent("on"+type,fun);
			}else{
				return false;
			};
		},
	/**
	 * @function _del 取消对象事件监听
	 * 	@param1 obj {object} [事件对象] 
	 * 	@param2 type {string} [事件] 
	 * 	@param3 type {function} [回调函数]
	 * 	@return {boolean} => true||false.
	 */	
		_del : function(obj,type,fun){
			if(obj.addEventListener){
				obj.removeEventListener(type,fun,false);
				return true;
			}else if(obj.attachEvent){
				obj.detachEvent("on"+type,fun);
				return true;
			}else{
				return false;
			};
		}
	};
	/**
	 * 解决鼠标事件over&out在子元素触发bug.
	 * @param1 theEvent {window event} 
	 * @param2 obj {object} [目标dom] 
	 * @param2 fn {function} [触发函式] 
	 */
	jScroll.isthisDom = jScroll.prototype.isthisDom = function(theEvent,obj,fn){  //theEvent用来传入事件，Firefox的方式
	    if (theEvent&&obj.contains){
	        if (browser.gecko||browser.webkit||browser.opera){ 
	            if (obj.contains(theEvent.relatedTarget)) {  
	                return;   //结束函式
	            }
	        }
	        if (browser.ie){  
	            if (obj.contains(event.toElement)) {  
	                return;  //结束函式
	            }
	        }
	    };fn();
	};
	/**
	 * 阻止默认浏览器动作.
	 * @param e {window event} 
	 * @return {bollean} false
	 */
	jScroll.stopDefault = jScroll.prototype.stopDefault = function( e ) { 
	    //阻止默认浏览器动作(W3C) 
	    if ( e && e.preventDefault ){ e.preventDefault(); }
	    //IE中阻止函数器默认动作的方式 
	    else {window.event.returnValue = false; }
	    return false; 
	};
	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.jScroll = jScroll;
	};
})();