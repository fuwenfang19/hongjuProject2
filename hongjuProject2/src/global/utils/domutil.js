/**
 * Created by uncle on 2017/3/4.
 */
import cookie from 'react-cookie';

const domUtil = {
	//获取元素的相对第一个非static父元素的位置
	getElementOffSet(HTMLDom) {
		return HTMLDom ? {
			top: HTMLDom.offsetTop,
			left: HTMLDom.offsetLeft,
			height: HTMLDom.offsetHeight,
			width: HTMLDom.offsetWidth
		} :
			console.error('元素不存在！')
	},
	isParent (obj, parentObj){
		while (obj != undefined && obj != null && obj.tagName.toUpperCase() != `BODY`) {
			if (obj == parentObj) {
				return true;
			}
			obj = obj.parentNode;
		}
		return false;
	},
	scrollToBottom: (selector) => {
		document.querySelector(selector).scrollTop = document.querySelector(selector).scrollHeight;
	},
	getUserInfo: () => {
		try {
			let u;
			u = cookie.load('userinfo');
			u = unescape(u.replace(/\\054/g, ',').replace(/\\"/g, '"').replace(/\\u/g, '%u').replace(/\\/g, ''));
			u = JSON.parse(u);
			u = u.userinfo[0];
			return u;
		} catch (e) {
			console.log('get cookie error : ' + e);
		}
	}
};


export default domUtil;
