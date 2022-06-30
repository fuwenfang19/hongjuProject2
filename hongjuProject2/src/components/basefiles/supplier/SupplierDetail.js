import React from 'react';
import {Button, Row, Col, Switch} from 'antd';
import {Toast, Confirm, renderLabelAndValues, DropdownList} from '../../../components/common';
class SupplierDetail extends React.Component {
  constructor() {
    super();

  }
  handDropDownBtnClick = (key) => {
  	if(key === 'delete') {
  		this.props.deleteSupplier();
		}
	}
  render() {
    const {currentSupplierDetail} = this.props;
    const buttons = [
      {
				key: 'btn1',
				size: 'small',
				type: 'primary',
				text: '下载模板',
				onClick: this.props.downloadTemplate
			},
			{
				key: 'btn2',
				size: 'small',
				type: 'primary',
				text: '导入数据',
				onClick: this.props.importDatas
			},
			{
				key: 'btn3',
				size: 'small',
				type: 'primary',
				text: '编辑供应商',
				disabled: this.props.currentSupplierDetail.id == null,
				onClick: this.props.editSupplier
			}
    ];
    const dropDownList = {trigger: 'click', data: [{id: 'delete', name: '删除'}]};
    return (
      <div className="content-right">
        <div className="content-right-head">
					<div
						className="head-left">{currentSupplierDetail.code ? '[' + currentSupplierDetail.code + '] ' + currentSupplierDetail.name : ''} </div>
					<div className="head-right">
						启用<Switch checked={currentSupplierDetail.status === "正常"} onChange={(value) => this.props.enableSupplier(value)} />
						{renderToolButton(buttons)}
						{/*<DropdownList {...dropDownList} clickAddItem={(key) => {
							this.handDropDownBtnClick(key);
						}}>
							<Button>更多...</Button>
						</DropdownList>*/}
					</div>
				</div>
        <div>
          <Row gutter={16}>
						{renderLabelAndValues('供应商编码', currentSupplierDetail.code, true)}
						{renderLabelAndValues('供应商名称', currentSupplierDetail.name, true)}
						{/*{renderLabelAndValues('开户行', currentSupplierDetail.bank)}*/}
						{/*{renderLabelAndValues('供应商地址', currentSupplierDetail.address)}*/}
						{/*{renderLabelAndValues('银行账号', currentSupplierDetail.bankAccount)}*/}
						{renderLabelAndValues('状态', currentSupplierDetail.status)}
					</Row>
					<Row gutter={16}>
						<Col className="gutter-row" span={6} style={{height: 34}}>
							<div style={{height: 34, lineHeight: '34px'}}>
								<span className="info-label">开户行:</span>

								<span className="info-value">{currentSupplierDetail.bank}</span>
							</div>
						</Col>
						<Col className="gutter-row" span={18} style={{height: 34}}>
							<div style={{height: 34, lineHeight: '34px'}}>
								<span className="info-label">银行账号:</span>

								<span className="info-value" style={{maxWidth: 420}}>{currentSupplierDetail.bankAccount}</span>
							</div>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col className="gutter-row" span={24} style={{height: 34}}>
							<div style={{height: 34, lineHeight: '34px'}}>
								<span className="info-label">供应商地址:</span>

								<span className="info-value" style={{maxWidth: 560}}>{currentSupplierDetail.address}</span>
							</div>
						</Col>
					</Row>
					<div className="single-line"></div>
        </div>
      </div>
    )
  }
}

//右侧功能按钮
function renderToolButton(buttons) {
	return buttons.map((button) => {
		return (
			<Button key={button.key} size={button.size} type={button.type} disabled={button.disabled}
			        onClick={button.onClick}>
				{button.text}
			</Button>
		)
	})
}

export default SupplierDetail;