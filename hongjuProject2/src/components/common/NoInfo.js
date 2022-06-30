/**
 * Created by uncle on 2017/2/28.
 */
/*
 	<NoInfo img={importImg} title="供应商" downloadTemplate={downloadTemplate} importDatas={importDatas}/>
 	img不传默认是../../images/basefiles/import_project.png
 	弹窗自写到downloadTemplate，importDatas中
*/
import React from 'react';
import {Button, Icon} from 'antd';
import Img from '../../images/basefiles/import_project.png';

class NoInfo extends React.Component {

	constructor() {
		super();

		this.downloadTemplate = this.downloadTemplate.bind(this);
		this.importDatas = this.importDatas.bind(this);
	}


	downloadTemplate() {
		this.props.downloadTemplate();
	}

	importDatas() {
		this.props.importDatas();
	}


	render() {
		const buttons = [
			{
				key: 'btn1',
				type: 'primary',
				size: 'large',
				text: '下载模板',
				iconType: 'download',
				onClick: this.downloadTemplate
			},
			{
				key: 'btn2',
				type: 'primary',
				size: 'large',
				text: '导入数据',
				iconType: 'upload',
				onClick: this.importDatas
			}
		];

		let img = this.props.img || Img;
		return (
			<div className="content-right">
				<div className="content-right-head">
					<div
						className="head-left">{this.props.title}
					</div>
					<div className="head-right">

					</div>
				</div>
				<div className="download_and_upload">
					<div>
						<div>
							<img src={img}/>
							<h3>还没有{this.props.title}信息呦，</h3>
							<h3>赶快点击下载模板，整理Excel文档，再批量导入数据吧！</h3>
						</div>
						<div className="btn-container">
							{renderToolButton(buttons)}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

//右侧功能按钮
function renderToolButton(buttons) {
	return buttons.map((button) => {
		return (
			<Button key={button.key} size={button.size} type={button.type} onClick={button.onClick}>
				<Icon type={button.iconType}/>
				{button.text}
			</Button>
		)
	})
}

export default NoInfo;