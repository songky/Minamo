/**
 * jquery 图片轮播
 * 使用前请引入Modernizr.js开源库
 *
 * Author by KwinSong
 *
 * Version: 1.0v
 *
 * Date: Wen Mar 02 2016
 */

(function($, undefined) {
	/*
	 * Minamo 对象
	 */
	$.Minamo      = function(options, element) {
		this.$ele = $(element);
		this._init(options);
	};
	// 默认参数
	$.Minamo.defaults = {
		current    : 0,
		// 定义图片从第几张开始
		autoplay   : false,
		// 定义是否自动播放，默认false
		interval   : 2000,
		// 定义自动播放的时间
		margintop  : '50px',
		// 定义图片上边距
		showlength : 1,
		// 定义显示的个数
		xoffsetshow: '350',
		// 定义当前显示图片的x轴位移
		xoffsethide: '450' // 定义当前隐藏图片的x轴位移
	};
	$.Minamo.prototype = {
		_init: function(options) {
			this.options = $.extend(true, {}, $.Minamo.defaults, options);
			// 检测浏览器是否支持3D transform
			this.support3d    = Modernizr.csstransforms3d;
			this.support2d    = Modernizr.csstransforms;
			this.supportTrans = Modernizr.csstransitions;
			this.$wrapper     = this.$ele.find('.wr-wrapper');
			this.$items       = this.$wrapper.children();
			this.itemsCount   = this.$items.length;
			this.$nav         = this.$ele.find('nav');
			this.$navPrev     = this.$nav.find('.wr-prev');
			this.$navNext     = this.$nav.find('.wr-next');
			this.$marginTop   = this.options.margintop;
			this.$showLength  = this.options.showlength;
			this.$XOffsetShow = this.options.xoffsetshow;
			this.$XOffsetHide = this.options.xoffsethide;
			// 判断图片子项个数，如果子项个数小余3，则不使用图片切换导航功能
			if (this.itemsCount < 3) {
				this.$nav.remove();
				return false;
			}
			this.current = this.options.current;
			this.isAnim  = false;
			// 初始化隐藏子项
			this.$items.css({
				'opacity'   : 0,
				'visibility': 'hidden'
			});
			// 验证方法
			this._validate();
			// 布局方法
			this._layout();
			// 事件方法
			this._loadEvents();
			// 图片自动轮播方法
			if (this.options.autoplay) {
				this._startSlideshow();
			}
		},
		// 验证，如果未定义current或current值大于子项个数，则定义current值为0
		_validate: function() {
			if (this.options.current < 0 || this.options.current > this.itemsCount - 1) {
				this.current = 0;
			}
		},
		// 布局，定义css
		_layout: function() {
			// 定义当前显示图片的左、中、右className
			this._setItems();
			var leftCSS, rightCSS, currentCSS;
			if (this.support3d && this.supportTrans) {
				// 支持3D
				// 初始化图片位置及可见性
				leftCSS = {
					'-webkit-transform': 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-200px)',
					'-moz-transform'   : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-200px)',
					'-o-transform'     : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-200px)',
					'-ms-transform'    : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-200px)',
					'transform'        : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-200px)',
					'margin-top'       : this.$marginTop
				};
				rightCSS = {
					'-webkit-transform': 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
					'-moz-transform'   : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
					'-o-transform'     : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
					'-ms-transform'    : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
					'transform'        : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
					'margin-top'       : this.$marginTop
				};
				leftCSS.opacity     = 1;
				leftCSS.visibility  = 'visible';
				rightCSS.opacity    = 1;
				rightCSS.visibility = 'visible';
			} else if (this.support2d && this.supportTrans) {
				// 支持2D
				// 初始化图片位置及可见性
				leftCSS   = {
					'-webkit-transform': 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
					'-moz-transform'   : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
					'-o-transform'     : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
					'-ms-transform'    : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
					'transform'        : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
					'margin-top'       : this.$marginTop
				};
				rightCSS  = {
					'-webkit-transform': 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
					'-moz-transform'   : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
					'-o-transform'     : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
					'-ms-transform'    : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
					'transform'        : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
					'margin-top'       : this.$marginTop
				};
				currentCSS = {
					'z-index': 999
				};
				leftCSS.opacity     = 1;
				leftCSS.visibility  = 'visible';
				rightCSS.opacity    = 1;
				rightCSS.visibility = 'visible';
			}
			// 添加样式
			this.$leftItm.css(leftCSS || {});
			this.$rightItm.css(rightCSS || {});
			// 居中图片样式、布局
			this.$currentItm.css(currentCSS || {}).css({
				'opacity'          : 1,
				'visibility'       : 'visible',
				'-webkit-transform': 'translateZ(-200px)',
				'-moz-transform'   : 'translateZ(-200px)',
				'-o-transform'     : 'translateZ(-200px)',
				'-ms-transform'    : 'translateZ(-200px)',
				'transform'        : 'translateZ(-200px)'
			}).addClass('wr-center');
			// attr赋值当前所有图片个数
			this.$currentItm.parent().attr('image_count', this.itemsCount);
		},
		// 获取标签
		_setItems: function() {
			this.$items.removeClass('wr-center');
			this.$currentItm = this.$items.eq(this.current);
			// 根据索引添加css
			// TODO 自定义添加索引 this.$showLength
			this.$leftItm  = (this.current === 0) ? this.$items.eq(this.itemsCount - this.$showLength) : this.$items.eq(this.current - this.$showLength);
			this.$rightItm = (this.current === this.itemsCount - this.$showLength) ? this.$items.eq(0) : this.$items.eq(this.current + this.$showLength);
			if (!this.support3d && this.support2d && this.supportTrans) {
				this.$items.css('z-index', 1);
				this.$currentItm.css('z-index', 999);
			}
			// 定义上下翻页
			if (this.itemsCount > 3) {
				// 下一张
				this.$nextItm = (this.$rightItm.index() === this.itemsCount - this.$showLength) ? this.$items.eq(0) : this.$rightItm.next();
				this.$nextItm.css(this._getCompany(this.$marginTop, 'outright'));
				// 上一张
				this.$prevItm = (this.$leftItm.index() === 0) ? this.$items.eq(this.itemsCount - this.$showLength) : this.$leftItm.prev();
				this.$prevItm.css(this._getCompany(this.$marginTop, 'outleft'));
			}
		},
		// 加载事件
		_loadEvents: function() {
			var _self = this;
			this.$navPrev.on('click.minamo', function(event) {
				if (_self.options.autoplay) {
					clearTimeout(_self.slideshow);
					_self.options.autoplay = false;
				}
				_self._navigate('prev');
				return false;
			});

			this.$navNext.on('click.minamo', function(event) {
				if (_self.options.autoplay) {
					clearTimeout(_self.slideshow);
					_self.options.autoplay = false;
				}
				_self._navigate('next');
				return false;
			});
			this.$wrapper.on('webkitTransitionEnd.minamo transitionend.minamo OTransitionEnd.minamo', function(event) {
				_self.$currentItm.addClass('wr-center');
				_self.$items.removeClass('wr-transition');
				_self.isAnim = false;
			});
		},
		// 重新定位图片
		_getCompany: function(margin_top, position) {
			if (this.support3d && this.supportTrans) {
				switch (position) {
					case 'outleft':
						return {
							'-webkit-transform': 'translateX(-' + (this.$XOffsetHide + 150) + 'px) translateZ(-300px)',
							'-moz-transform'   : 'translateX(-' + (this.$XOffsetHide + 150) + 'px) translateZ(-300px)',
							'-o-transform'     : 'translateX(-' + (this.$XOffsetHide + 150) + 'px) translateZ(-300px)',
							'-ms-transform'    : 'translateX(-' + (this.$XOffsetHide + 150) + 'px) translateZ(-300px)',
							'transform'        : 'translateX(-' + (this.$XOffsetHide + 150) + 'px) translateZ(-300px)',
							'opacity'          : 0,
							'visibility'       : 'hidden',
							'margin-top'       : margin_top
						};
						break;
					case 'outright':
						return {
							'-webkit-transform': 'translateX(' + (this.$XOffsetShow + 150) + 'px) translateZ(-300px)',
							'-moz-transform'   : 'translateX(' + (this.$XOffsetShow + 150) + 'px) translateZ(-300px)',
							'-o-transform'     : 'translateX(' + (this.$XOffsetShow + 150) + 'px) translateZ(-300px)',
							'-ms-transform'    : 'translateX(' + (this.$XOffsetShow + 150) + 'px) translateZ(-300px)',
							'transform'        : 'translateX(' + (this.$XOffsetShow + 150) + 'px) translateZ(-300px)',
							'opacity'          : 0,
							'visibility'       : 'hidden',
							'margin-top'       : margin_top
						};
						break;
					case 'left':
						return {
							'-webkit-transform': 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-190px)',
							'-moz-transform'   : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-190px)',
							'-o-transform'     : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-190px)',
							'-ms-transform'    : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-190px)',
							'transform'        : 'translateX(-' + this.$XOffsetHide + 'px) translateZ(-190px)',
							'opacity'          : 1,
							'visibility'       : 'visible',
							'margin-top'       : margin_top
						};
						break;
					case 'right':
						return {
							'-webkit-transform': 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
							'-moz-transform'   : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
							'-o-transform'     : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
							'-ms-transform'    : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
							'transform'        : 'translateX(' + this.$XOffsetShow + 'px) translateZ(-210px)',
							'opacity'          : 1,
							'visibility'       : 'visible',
							'margin-top'       : margin_top
						};
						break;
					case 'center':
						return {
							'-webkit-transform': 'translateZ(-200px)',
							'-moz-transform'   : 'translateZ(-200px)',
							'-o-transform'     : 'translateZ(-200px)',
							'-ms-transform'    : 'translateZ(-200px)',
							'transform'        : 'translateZ(-200px)',
							'opacity'          : 1,
							'visibility'       : 'visible',
							'margin-top'       : '-1px'
						};
						break;
				}
			} else if (this.support2d && this.supportTrans) {
				switch (position) {
					case 'outleft':
						return {
							'-webkit-transform': 'translate(-' + (this.$XOffsetHide + 150) + 'px) scale(0.7)',
							'-moz-transform'   : 'translate(-' + (this.$XOffsetHide + 150) + 'px) scale(0.7)',
							'-o-transform'     : 'translate(-' + (this.$XOffsetHide + 150) + 'px) scale(0.7)',
							'-ms-transform'    : 'translate(-' + (this.$XOffsetHide + 150) + 'px) scale(0.7)',
							'transform'        : 'translate(-' + (this.$XOffsetHide + 150) + 'px) scale(0.7)',
							'opacity'          : 0,
							'visibility'       : 'hidden',
							'margin-top'       : margin_top
						};
						break;
					case 'outright':
						return {
							'-webkit-transform': 'translate(' + (this.$XOffsetShow + 150) + 'px) scale(0.7)',
							'-moz-transform'   : 'translate(' + (this.$XOffsetShow + 150) + 'px) scale(0.7)',
							'-o-transform'     : 'translate(' + (this.$XOffsetShow + 150) + 'px) scale(0.7)',
							'-ms-transform'    : 'translate(' + (this.$XOffsetShow + 150) + 'px) scale(0.7)',
							'transform'        : 'translate(' + (this.$XOffsetShow + 150) + 'px) scale(0.7)',
							'opacity'          : 0,
							'visibility'       : 'hidden',
							'margin-top'       : margin_top
						};
						break;
					case 'left':
						return {
							'-webkit-transform': 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
							'-moz-transform'   : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
							'-o-transform'     : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
							'-ms-transform'    : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
							'transform'        : 'translate(-' + this.$XOffsetHide + 'px) scale(0.8)',
							'opacity'          : 1,
							'visibility'       : 'visible',
							'margin-top'       : margin_top
						};
						break;
					case 'right':
						return {
							'-webkit-transform': 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
							'-moz-transform'   : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
							'-o-transform'     : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
							'-ms-transform'    : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
							'transform'        : 'translate(' + this.$XOffsetShow + 'px) scale(0.8)',
							'opacity'          : 1,
							'visibility'       : 'visible',
							'margin-top'       : margin_top
						};
						break;
					case 'center':
						return {
							'-webkit-transform': 'translateZ(-200px)',
							'-moz-transform'   : 'translateZ(-200px)',
							'-o-transform'     : 'translateZ(-200px)',
							'-ms-transform'    : 'translateZ(-200px)',
							'transform'        : 'translateZ(-200px)',
							'opacity'          : 1,
							'visibility'       : 'visible'
						};
						break;
				}
			} else {
				switch (position) {
					case 'outleft' :
					case 'outright':
					case 'left'    :
					case 'right'   :
						return {
							'opacity'   : 0,
							'visibility': 'hidden'
						};
						break;
					case 'center'  :
						return {
							'opacity'   : 1,
							'visibility': 'visible'
						};
						break;
				}
			}
		},
		// 翻页导航
		_navigate: function(dir) {
			if (this.supportTrans && this.isAnim) return false;
			this.isAnim = true;
			switch (dir) {
				case 'next':
					this.current = this.$rightItm.index();
					// 居中图片左移
					this.$currentItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'left'));
					// 居右图片左移居中
					this.$rightItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'center'));
					// 隐藏的右图左移
					if (this.$nextItm) {
						// 左图隐藏
						this.$leftItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'outleft'));
						// 右图显示
						this.$nextItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'right'));
					} else {
						// 循环翻页
						this.$leftItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'right'));
					}
					break;
				case 'prev':
					this.current = this.$leftItm.index();
					// 居中图片右移
					this.$currentItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'right'));
					// 居左图片右移居中
					this.$leftItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'center'));
					// 隐藏的左图右移
					if (this.$prevItm) {
						// 右图隐藏
						this.$rightItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'outright'));
						// 左图显示
						this.$prevItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'left'));
					} else {
						// 循环翻页
						this.$rightItm.addClass('wr-transition').css(this._getCompany(this.$marginTop, 'left'));
					}
					break;
			}
			this._setItems();
			if (!this.supportTrans) this.$currentItm.addClass('wr-center');
		},
		// 开始轮播图片
		_startSlideshow: function() {
			var _self      = this;
			this.slideshow = setTimeout(function() {
				_self._navigate('next');
				if (_self.options.autoplay) {
					_self._startSlideshow();
				}
			}, this.options.interval);
		},
		// 移除
		destroy: function() {
			this.$navPrev.off('.minamo');
			this.$navNext.off('.minamo');
			this.$wrapper.off('.minamo');
		}
	};
	$.fn.minamo = function(options) {
		if (typeof(options) === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function() {
				var instance = $.data(this, 'minamo');
				if (!instance) {
					// 控制台打印错误信息
					console.error("初始化失败;" + "调用'" + options + "'方法失败!");
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
					// 控制台打印错误信息
					console.error("未定义的方法:'" + options + "';");
					return;
				}
				instance[options].apply(instance, args);
			});
		} else {
			this.each(function() {
				var instance = $.data(this, 'minamo');
				if (!instance) {
					$.data(this, 'minamo', new $.Minamo(options, this));
				}
			});
		}
		return this;
	};
})(jQuery);