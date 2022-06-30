/**
 * Created by yangyfe on 2017/2/23.
 * 部门成员上传文件页面
 */

/**
 * Created by uncle on 2017/2/28.
 */
import React from 'react';
import {Button,Icon} from 'antd';
import importImg from '../../images/basefiles/import_project.png';

class DepartmentFiles extends React.Component {
    constructor() {
        super();
        this.downloadTemplate = this.downloadTemplate.bind(this);
        this.testConfirm = this.testConfirm.bind(this);
    }
    //下载模板
    downloadTemplate() {
        this.props.downloadTemplate();
    }
    //导入数据
    testConfirm() {
        this.props.testConfirm();
    }
    render() {
        const buttons = [
            {
                key: 'btn1',
                size: 'small',
                type: 'primary',
                text: '下载模板',
                iconType: 'download',
                onClick: this.downloadTemplate
            },
            {
                key: 'btn2',
                size: 'small',
                type: 'primary',
                text: '导入数据',
                iconType: 'upload',
                onClick: this.testConfirm
            }
        ];
        return (
            <div className="content-right">
                <div className="content-right-head">
                    <div
                        className="head-left">部门
                    </div>
                    <div className="head-right">
                    </div>
                </div>
                <div className="download_and_upload">
                    <div>
                        <div>
                            <img src={importImg}/>
                            <p>还没有部门信息呦，</p>
                            <p>赶快点击下载模板，整理Excel文档，再批量导入数据吧！</p>
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

export default DepartmentFiles;
