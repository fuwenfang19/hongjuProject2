import NetWork from '../../../global/utils/network';
import Toast from '../Toast';

// 初始化数据
export function getInitData(reqParam, url, that) {
	let userInfo = window.getUserInfo();
	if (that.props.type === 'group' && userInfo.groupid === 9999) {
		window.loading.remove();
		that.setState({
			data: [{
				name: userInfo['companyname'],
				code: '',
				id: userInfo['company']
			}],
			fetchData: false,
			page: 1
		});
		return;
	}

	NetWork.get(url, reqParam, (json) => {
		let data = json.rows || json.data || json;

		if (that.props.type === 'selfDefine') {
			data = json['childs'];
		}


		if (that.props.type === 'billType') {//单据类型本地搜索
			if (reqParam.namelike.trim() !== '') {
				data = data.filter((item) => {
					// item.code.indexOf(reqParam.namelike) !== -1 ||
					return item.name.indexOf(reqParam.namelike) !== -1
				})
			}
		}


		if (data.length <= 0) {
			window.loading.remove();
			that.setState({
				data: [],
				fetchData: false,
				page: 1
			});

			return;
		}
		that.setState({
			data,
			page: 1 + 1,
			url,
			fetchData: false
		});

		that.file_choose_flag = true;
		window.loading.remove();

	});
}

//搜索数据
export function searchData(reqParam, url, that) {
	NetWork.get(url, reqParam, (json) => {
		let data = json.rows || json.data || json;
		if (that.props.type === 'selfDefine') {
			data = json['childs'];
		}

		if (that.props.type === 'billType') {//单据类型本地搜索
			data = data.filter((item) => {
				// item.code.indexOf(reqParam.namelike) !== -1 ||
				return item.name.indexOf(reqParam.namelike) !== -1
			})
		}

		if (data.length <= 0) {
			window.loading.remove();
			that.setState({
				data: [],
				fetchData: false
			});

			return;
		}
		that.setState({
			data,
			fetchData: false
		});

		that.file_choose_flag = true;
		window.loading.remove();

	});
}

// 滚动加载数据
export function scrollGetData(reqParam, url, that) {
	NetWork.get(url, reqParam, (json) => {

		let appendData = json.rows || json.data || json;
		if (that.props.type === 'selfDefine') {
			appendData = json['childs'];
		}
		let data = that.state.data;
		if (appendData.length <= 0) {
			window.loading.remove();
			return;
		}
		that.setState({
			data: data.concat(appendData),
			page: that.state.page + 1
		});
		that.file_choose_flag = true;
		window.loading.remove();
	});

}

//获取当前公司所在集团的所有公司

export function getCompanyGroup(url, reqParam, that) {
	NetWork.get(url, reqParam, (json) => {

		that.setState({
			companyGroup: json
		});
	});
}