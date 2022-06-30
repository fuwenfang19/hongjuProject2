/**
 * 脚本名称：页面加载Loading脚本
 * 脚本说明：
 * 1.因为使用到document.body.scrollHeight对象，脚本引入时，脚本应放到body内，否则报错；
 */

// window.loading.add();
// window.loading.remove();
let pic = require('./loading.png');
window.loading = {};

window.loading = {
	add: function (opacity, imgopacity) {
		opacity = opacity === undefined ? 0 : opacity;
		imgopacity = imgopacity === undefined ? 0.8 : imgopacity;
		var arr = this.getPageSize();
		var width = parseInt(arr[2]);
		var height = parseInt(arr[3]);

		//背景遮罩
		var mask = document.createElement("div");
		mask.id = 'mask';
		mask.style.position = 'fixed';
		mask.style.left = '0';
		mask.style.top = '0';
		mask.style.width = '100%';
		mask.style.height = parseInt(arr[1]) + "px";
		mask.style.background = "rgba(0,0,0," + opacity + ")";
		mask.style.zIndex = "10000";
		mask.addEventListener('touchstart', function (e) {
			e.preventDefault();
		}, false);   //触摸事件
		mask.addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);    //滑动事件
		mask.addEventListener('touchend', function (e) {
			e.preventDefault();
		}, false);         //离开元素事件
		document.body.appendChild(mask);

		//提示文本
		var loading = document.createElement("img");
		loading.id = 'hj_loading';
		loading.src = pic;
		loading.style.position = 'absolute';
		loading.style['user-select'] = "none";
		loading.style.left = 0;
		loading.style.top = 0;
		loading.style.bottom = 0;
		loading.style.right = 0;
		loading.style.margin = 'auto';
		loading.style.width = '40px';
		loading.style.opacity = imgopacity;
		loading.style['border-radius'] = '40px';
		loading.style.height = "40px";
		loading.style.display = "inline-block";
		loading.style.padding = "0";
		loading.style.animation = "loadingChange 2s linear infinite";
		loading.style.zIndex = "100001";

		document.body.appendChild(loading);
	},
	mask: function () {
		var element = document.getElementById("mask");
		return element;
	},
	remove: function () {
		try {
			var element = document.getElementById("mask");
			element.parentNode.removeChild(element);
			element = document.getElementById("hj_loading");
			element.parentNode.removeChild(element);
		} catch (e) {
			return;
		}

	},
	getPageSize: function () {
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else {
			if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
		}
		var windowWidth = 0;
		var windowHeight = 0;
		var pageHeight = 0;
		var pageWidth = 0;

		if (self.innerHeight) { // all except Explorer
			if (document.documentElement.clientWidth) {
				windowWidth = document.documentElement.clientWidth;
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else {
			if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else {
				if (document.body) { // other Explorers
					windowWidth = document.body.clientWidth;
					windowHeight = document.body.clientHeight;
				}
			}
		}
		// for small pages with total height less then height of the viewport

		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}
		// for small pages with total width less then width of the viewport
		if (xScroll < windowWidth) {
			pageWidth = xScroll;
		} else {
			pageWidth = windowWidth;
		}
		var arrayPageSize = [pageWidth, pageHeight, windowWidth, windowHeight];
		return arrayPageSize;
	}
};

