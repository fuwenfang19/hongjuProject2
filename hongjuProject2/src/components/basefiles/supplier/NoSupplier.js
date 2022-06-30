
import React from 'react';
import {Button, Icon} from 'antd';
import Img from '../../../images/basefiles/supplier.png';

class NoSupplier extends React.Component {

	constructor() {
		super();
	}


	addSupplier = () => {
		this.props.editSupplier(true);
	}



	render() {
		const buttons = [
			{
				key: 'btn1',
				type: 'primary',
				size: 'large',
				text: '新建供应商',
				iconType: 'plus',
				onClick: this.addSupplier
			}
		];

		let img = this.props.img || Img;
		return (
			<div className="content-right">
				<div className="content-right-head">
					<div
						className="head-left">供应商
					</div>
					<div className="head-right">

					</div>
				</div>
				<div className="download_and_upload">
					<div>
						<div>
							<img src={img} style={{width: 131}}/>
							<h3>还没有可选供应商呦，</h3>

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

export default NoSupplier;