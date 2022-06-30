/**
 * Created by uncle on 2017/4/10.
 */
import React from 'react';
import {Button} from 'antd';

export default (isEditing, actions, title = '') => {
	return (
		<div className='content-right-head'>
			<div className='head-left'>{title}</div>
			{
				!isEditing ? (
					<div className='head-right'>
						<Button type='primary' onClick={actions.onEditClick}>编辑</Button>
						<Button type='primary' onClick={actions.onAddClick}>新增</Button>
					</div>
				) : (
					<div className='head-right'>
						<Button type='default' onClick={actions.onCancelClick}>取消</Button>
						<Button type='primary' onClick={actions.onSaveClick}>保存</Button>
						<Button type='primary' onClick={actions.onAddClick}>新增</Button>
					</div>
				)
			}
		</div>
	)
};