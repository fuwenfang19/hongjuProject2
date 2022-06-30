/**
 * 修改自hj-wx
 * 在get发放中增加了参数
 */

import fetchJsonp from 'fetch-jsonp';

const isDev = process.env.NODE_ENV === 'development';

const isEmptyObject = function (obj) {
	return Object.keys(obj).length === 0;
};
const addLoading = function () {
	if (document.querySelector('#hj_loading')) {
	}else{
		window.loading.add();
	}
};


//封装fetch
/**
 * 使用
 * 针对咱们系统后台 get请求都有param参数
 * 调用的时候直接传递param里面的对象即可
 * 比如
 * const params = {status:1};
 * NetWork.get('/your/url/',params,successCallBack,FailCallBack)
 */

const NetWork = {
	getUrl: (url) => isDev ? '/api' + url : url,
	get: (url, reqData, successCallback, failCallback) => {
		url = NetWork.getUrl(url);
		if (typeof reqData !== 'function') {
			if (reqData) {
				url = url + '?param=' + encodeURIComponent(JSON.stringify(reqData))
			}
		} else {
			failCallback = successCallback;
			successCallback = reqData;
		}
		console.log(url);
		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Accept': 'text/html, application/json',
				'Content-Type': 'application/json',
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json().then(json => {
						if (successCallback)
							successCallback(json);
					});
				}
				else {
					return response.json().then(json => {
						if (failCallback) {
							failCallback(getError(json));
						}

					});
				}
			})
	},
	/**
	 * 使用
	 * 针对咱们系统后台 get请求都有param参数
	 * 调用的时候直接传递param里面的对象即可
	 * 比如
	 * const params = {status:1};
	 * NetWork.post('/your/url/',params,successCallBack,FailCallBack)
	 */
	post: (url, body, successCallback, failCallback) => {
		addLoading();
		console.log(url);
		url = NetWork.getUrl(url);
		const jsonText = JSON.stringify(body);
		console.log(jsonText);
		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			body: jsonText,
			headers: {
				'Accept': 'text/html, application/json',
				'Content-Type': 'application/json',
			}
		})
			.then(response => {
				if (response.ok) {
					window.loading.remove();
					return response.json().then(json => {
						if (successCallback)
							successCallback(json);
					});
				}
				else {
					window.loading.remove();
					return response.json().then(json => {
						if (failCallback)
							failCallback(getError(json));
					});
				}
			})
	},
	jsonp: (url, successCallback, failCallback) => {
		fetchJsonp(url)
			.then(response => {
				if (response.ok) {
					return response.json().then(json => {
						if (successCallback)
							successCallback(json);
					});
				}
				else {
					return response.json().then(json => {
						if (failCallback) {
							failCallback(getError(json));
						}
					});
				}
			})
	},
	put: (url, body, successCallback, failCallback) => {
		addLoading();
		console.log(url);
		url = NetWork.getUrl(url);
		if (typeof body === 'function') {
			console.error('put 方法第二个参数是要传递给后台的数据,如果没有参数传null');
		}
		const jsonText = JSON.stringify(body);
		console.log(jsonText);
		return fetch(url, {
			method: 'PUT',
			credentials: 'include',
			body: jsonText,
			headers: {
				'Accept': 'text/html, application/json',
				'Content-Type': 'application/json',
			}
		})
			.then(response => {
				if (response.ok) {
					window.loading.remove();
					return response.json().then(json => {
						if (successCallback)
							successCallback(json);
					});
				}
				else {
					window.loading.remove();
					return response.json().then(json => {
						if (failCallback)
							failCallback(getError(json));
					});
				}
			})
	},
	delete: (url, body, successCallback, failCallback) => {
		console.log(url);
		url = NetWork.getUrl(url);
		const jsonText = JSON.stringify(body);
		console.log(jsonText);
		if (typeof body === 'function') {
			failCallback = successCallback;
			successCallback = body;
		}
		return fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			body: jsonText,
			headers: {
				'Accept': 'text/html, application/json',
				'Content-Type': 'application/json',
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json().then(json => {
						if (successCallback)
							successCallback(json);
					});
				}
				else {
					return response.json().then(json => {
						if (failCallback)
							failCallback(getError(json));
					});
				}
			})
	},
	download: (url, reqData) => {
		url = NetWork.getUrl(url);
		if (reqData) {
			url = url + '?param=' + encodeURIComponent(JSON.stringify(reqData))
		}
		window.location.href = url;
	}
};

/**
 * 获取错误信息方法
 * 暂时列出两种条件 后续有新增的再添加进来 统一把错误信息放在msg中
 */
const getError = function (json) {
	if (json.msg) {
		return json
	} else if (json.data) {
		return {msg: json.data};
	} else if (typeof json === 'string') {
		return {msg: json};
	}
};

export default NetWork;

