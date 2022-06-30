/**
 * Created by uncle on 2017/2/23.
 * 基本同antd Modal.confirm
 * 不同：content不支持传ReactDom，需要传一个js对象
 * content:{
 *  message:'提示信息',
 *  explain:'详细说明'
 * },
 *
 * isUpload:false,//是否是导入数据confirm
 *
 * 普通示例：
 * Confirm({
			title: 'testTitle',
			content: {
				message: '如果您设置了highLightText为"财务部门"，那么 财务部门 将是高亮显示；',
				explain: '解释说明',
				highLightText:'财务部门',
			},
			okText:'确定',
			cancelText:'取消',
			onOk: () => {

			},
			onCancel: () => {
			}
		});
 *
 *
 * 导入示例：
 * Confirm({
			title: '导入项目数据',
			isUpload:true,
			fileDataFormName:'fileData',
			uploadConfig:{
				url:'',//上传的url
				data:{},//上传时需要的参数
				accept:'',//接收的文件类型 不传是xls和xlsx
			},
			onFileUploading:(percent) => {//参数是百分比 纯数字
			},
			onFileUploadSuccess: (response) => {//返回的是上传结束后的response
			},
			onOk: () => {

			},
			onCancel: () => {
			}
		});
 *
 */
import React from 'react';
import Toast from './Toast'
import {Modal, Upload, Icon, Progress} from 'antd';

const Dragger = Upload.Dragger;

let confirm;
function Confirm(config) {
	let {
		isUpload = false, onFileUploadSuccess, onFileUploading, uploadConfig, title, content, onOk, onCancel,
		maskClosable = false, okText = isUpload ? '导入' : '确定', cancelText = isUpload ? '关闭' : '取消', showUploadList = false, fileDataFormName = 'Filedata'
	} = config;
	let contentDom = undefined;
	if (isUpload) {//文件上传
		if (uploadConfig === undefined) {
			console.error('Confirm组件，当isUpload:true时，必须传uploadConfig参数！');
			return;
		}
		let dragConfig = {
			name: 'file',
			multiple: false,
			showUploadList: showUploadList,
			action: uploadConfig.url,
			data: function (file) {
				return {...uploadConfig.data, [fileDataFormName]: file}
			},//参数
			accept: uploadConfig.accept || '.xls,.xlsx',// 图片可以传image/*
			headers:{
				Accept:"application/json, text/plain, */*"
			},
			withCredentials: true,//携带cookie
			beforeUpload: function (file, fileList) {
				let accept = dragConfig.accept.split(',');
				let fileType = file.name.substr(file.name.lastIndexOf('.'));
				if (accept.indexOf(fileType) === -1) {
					Toast.error(`请上传${accept.join()}类型的文件`);
					return false;
				}
				window.loading.add();
			},
			//percent:0,
			onChange(info) {
				const status = info.file.status;
				if (status === 'uploading') {
					console.log(`正在上传${info.file.percent}%`);//进度
					if (onFileUploading) {
						onFileUploading(info.file.percent);
					}
				} else if (status === 'done') {
					if (onFileUploadSuccess) {
						onFileUploadSuccess(info.file.response);
						confirm.destroy();
					}
					window.loading.remove();
				} else if (status === 'error') {
					Toast.error(`上传失败：${info.file.response.msg || info.file.response.data}`);
					window.loading.remove();
				}
			},
			warningText: config.uploadConfig.warningText ? config.uploadConfig.warningText : ''
		};
		contentDom = renderUploadHtml(dragConfig);
	} else {
		let highLightText = content.highLightText || "";
		let messageText = content.message || "";

		let message = React.createElement('div', {className: 'content-message'}, getMessageDom(messageText, highLightText));
		let explain = React.createElement('div', {className: 'content-explain'}, content.explain || "");
		contentDom = React.createElement('div', {className: 'confirm-container'}, message, explain);
	}

	confirm = Modal.confirm({
		title: title,
		content: contentDom,
		onOk() {
			onOk();
		},
		onCancel() {
			onCancel();
		},
		maskClosable: maskClosable,
		closable: true,
		okText: okText,
		cancelText: cancelText
	});
	isUpload ? document.getElementsByClassName('ant-confirm-btns')[0].style.display = 'none' : '';
}

function getMessageDom(messageText, highLightText) {
	if (highLightText.trim() !== '') {
		return (
			<span
				dangerouslySetInnerHTML={{__html: messageText.replace(new RegExp(highLightText, 'gi'), '<span class="confirm-high">' + highLightText + '</span>')}}>
			</span>
		)
	} else {
		return (
			<span>
				{messageText}
			</span>
		)
	}

}

function renderUploadHtml(dragConfig) {
	let div = (
		<div style={{marginTop: 16, height: 180}}>
			<Dragger {...dragConfig}>
				<p className="ant-upload-drag-icon">
					<Icon type="cloud-upload-o"/>
				</p>
				<p className="ant-upload-text">点击上传或拖拽上传</p>
				<p className="ant-upload-remark">{dragConfig.warningText}</p>
			</Dragger>
		</div>);
	return React.createElement('div', {className: 'content-upload'}, div || "");
}

export default Confirm;





