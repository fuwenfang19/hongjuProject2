/**
 * Created by fuwenfang on 4/17/17.
 */
// 获取url参数值


export default function getQueryString(name) {
	let after = window.location.hash.split("?")[1];
	if (after) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		let r = after.match(reg);
		if (r !== null) {
			return decodeURIComponent(r[2]);
		}
		else {
			return null;
		}
	}
}
