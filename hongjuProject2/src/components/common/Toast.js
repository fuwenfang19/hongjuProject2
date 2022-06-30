/**
 * Created by uncle on 17/2/16.
 * 调用示例：
 *  Toast.success('你的成功提示信息');
 *  Toast.info('你的一般提示信息');
 *  Toast.warning('你的警告提示信息');
 *  Toast.error('你的错误提示信息');
 */

import {notification} from 'antd';

notification.config({
	placement: 'bottomRight',
	bottom: 50,
	duration: 4,
});

const openNotificationWithIcon = (type, title, text, config) => {
	notification[type]({
		message: title,
		description: text,
		...config
	});

	if (type === 'error') {
		window.setTimeout(() => {
			document.querySelector('.ant-notification-notice.ant-notification-notice-closable').style.borderColor = 'red';
		}, 100);
	} else {// #449ff7
		window.setTimeout(() => {
			document.querySelector('.ant-notification-notice.ant-notification-notice-closable').style.borderColor = '#449ff7';
		}, 100);
	}
};

const Toast = {
	success: (text) => {
		openNotificationWithIcon('success', '', text)
	},
	info: (text) => {
		openNotificationWithIcon('info', '', text)
	},
	warning: (text) => {
		openNotificationWithIcon('warning', '', text)
	},
	error: (text) => {
		openNotificationWithIcon('error', '', text, {duration: 10})
	}
};


export default Toast;