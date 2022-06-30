/**
 * Created by uncle on 2017/2/28.
 */
import React from 'react';
import {Col} from 'antd';
//信息项 label:value
export default (labelName, value, isRequire,spanNum) => {
	return (
		<Col span={spanNum ? spanNum : 6} style={{height: 34, padding: 0}}>
			<div style={{height: 34, lineHeight: '34px'}}>
				<span className="info-label">{labelName}<span>{isRequire ? <span className="require-star">*</span> : ''}</span>:</span>

				<span className="info-value">{value}</span>
			</div>
		</Col>
	)
}