/**
 * Created by uncle on 2017/5/31.
 */

import _ from 'lodash';
import {inputTypesMap} from '../../constants/inputType';
import {Toast} from '../../components/common';

/**
 * /**
 * 根据预算申请单据类型定义 生成table的column定义
 * columns 是适合于antd Table的表头定义 addDataTemp是表格增加数据的模板
 * @param schema 预算申请单据类型定义
 * @param budgetYear 预算年 如果是自定义则传0
 * @param isAdjustBill 是否是预算调整申请
 * @return {{columns: Array, addDataTemp: {}}}
 */
export const changeSchemaToTableColumns = (schema, budgetYear, isAdjustBill) => {
	// 预算表体的表格 列维度称为纵向展开，行维度称为航向展开，目前纵向展开支持多选，横向支持一维度
	// 横向一个维度时 一般是3行，第一行是期间，第二行是选择的横向展开维度，第三行是预算数，执行数等
	// 如果期间类型是年，或者自定义期间 则不显示第一行，此时表头为两行
	// 如果横向展开维度没有设置，则不显示第二行，此时表头为两行
	// 如果前两种都不存在，只显示第三行，此时表头为一行

	let columns = [];
	let addDataTemp = {columndict: {}};
	let scrollX = 0;
	const colWidth = 150;
	const leftColWidth = 180;
	let colTpl = {
		width: colWidth,
		title: '',
		children: [],
	};
	let leftColTpl = {
		title: '',
		dataIndex: '',
		key: '',
		width: leftColWidth,
		fixed: 'left',
	};
	let temp = {};

	// 获得末级表头的column定义 第三行
	const getFinalColumns = (timeIndex, keyCode, isAdjustBill, dimNameObj) => {
		let arr = [], temp = {};
		// keyCode 末尾为0 则不需要添加期间序号
		let keyCodeArr = keyCode.split('_');
		if (keyCodeArr[keyCodeArr.length - 1] === '') {
			keyCode += (keyCode.lastIndexOf('0') === keyCode.length - 1 ? '' : timeIndex);
		}
		const originKeyCode = keyCode;
		keyCode = 'columndict.' + keyCode;
		if (isAdjustBill) {
			temp = _.cloneDeep(colTpl);
			temp.title = '预算';
			temp.dataIndex = keyCode + '.amount';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number'
			};
			delete temp.children;
			arr.push(temp);

			temp = _.cloneDeep(colTpl);
			temp.children = undefined;
			temp.title = '预占';
			temp.dataIndex = keyCode + '.amount';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number',
				step: '0.01',
			};
			delete temp.children;
			arr.push(temp);

			temp = _.cloneDeep(colTpl);
			temp.children = undefined;
			temp.title = '执行';
			temp.dataIndex = keyCode + '.amount';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number',
				step: '0.01',
			};
			delete temp.children;
			arr.push(temp);

			temp = _.cloneDeep(colTpl);
			temp.children = undefined;
			temp.title = '调整';
			temp.dataIndex = keyCode + '.amount';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number',
				step: '0.01',
			};
			delete temp.children;
			arr.push(temp);

			if (dimNameObj) {
				addDataTemp.columndict[originKeyCode] = {amount: null, money1: null, ...dimNameObj}
			} else {
				addDataTemp.columndict[originKeyCode] = {amount: null, money1: null,}
			}
			scrollX += colWidth * 4;
		} else {
			temp = _.cloneDeep(colTpl);
			temp.children = undefined;
			temp.title = '预算';
			temp.dataIndex = keyCode + '.amount';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number',
				step: '0.01',
			};
			delete temp.children;
			arr.push(temp);

			temp = _.cloneDeep(colTpl);
			temp.children = undefined;
			temp.title = '执行';//期初执行
			temp.dataIndex = keyCode + '.used';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number',
				step: '0.01',
			};
			delete temp.children;
			arr.push(temp);

			temp = _.cloneDeep(colTpl);
			temp.children = undefined;
			temp.title = '调整';//期初调整
			temp.dataIndex = keyCode + '.adjusted';
			temp.key = temp.dataIndex;
			temp.dataType = {
				type: 'number',
				step: '0.01',
			};
			delete temp.children;
			arr.push(temp);
			if (dimNameObj) {
				addDataTemp.columndict[originKeyCode] = {amount: null, money1: null, ...dimNameObj}
			} else {
				addDataTemp.columndict[originKeyCode] = {amount: null, money1: null,}
			}
			scrollX += colWidth * 3;
		}
		return arr;
	};
	// 获取横线展开维度的定义 第二行
	const getHorizontalColumns = (timeIndex, keyCode, isAdjustBill, horizontalBodyValues) => {
		let arr = [], temp = {};

		horizontalBodyValues.forEach((item) => {
			temp = _.cloneDeep(colTpl);
			// keyCode 末尾为0 则不需要添加期间序号
			keyCode = keyCode + (keyCode.lastIndexOf('0') === keyCode.length - 1 ? '' : timeIndex) + '_' + (item.value.id || 0);
			const dim_nameCode = item.dimensionRef.item_code + 'Name';
			const dimCodeNameValue = item.value.name;
			temp.children = getFinalColumns(timeIndex, keyCode, isAdjustBill, {[dim_nameCode]: dimCodeNameValue});
			temp.title = item.value.name;
			delete temp.width;
			arr.push(temp);
		});
		return arr;
	};
	// 获取期间表头定义 第一行
	const getTimeColumns = (kind) => {
		let arr = [], temp = {};
		const getCol = (timeNameArr) => {
			timeNameArr.forEach(item => {
				temp = _.cloneDeep(colTpl);
				temp.title = item;
				delete temp.width;
				arr.push(temp);
			});
		};
		// 期间类型(0:全年,1:半年,2:季度,3:月份,4:自定义期间)
		if (kind === 1) {
			getCol(['上半年', '下半年']);
		} else if (kind === 2) {
			getCol(['第一季度', '第二季度', '第三季度', '第四季度']);
		} else if (kind === 3) {
			getCol(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);
		}
		return arr;
	};


	const kind = schema.kind;//期间类型(0:全年,1:半年,2:季度,3:月份,4:自定义期间)
	let keyCode = `${kind === 4 ? 0 : 1}_${kind === 4 ? 0 : budgetYear}_${kind}_${[0, 4].indexOf(kind) !== -1 ? 0 : ''}`;

	// 横线展开的维度
	if ([0, 4].indexOf(kind) !== -1) {
		// 如果是全年和自定义期间 不显示上述所谓的第一列
		if (schema.horizontalBody.length !== 0) {
			// 如果存在横向展开维度，则表头是两行的情况
			columns = columns.concat(getHorizontalColumns(0, keyCode, isAdjustBill, schema.horizontalBodyValues));
		} else {
			// 如果不存在横向展开维度，则表头是一行的情况
			columns = columns.concat(getFinalColumns(0, keyCode, isAdjustBill));
		}
	} else {
		// 如果不是全年和自定义期间 显示期间行
		columns = columns.concat(getTimeColumns(kind));

		if (schema.horizontalBody.length !== 0) {
			// 如果存在横向展开维度，则表头是三行的情况
			columns.forEach((item, timeIndex) => {
				if (item.children) {
					item.children = item.children.concat(getHorizontalColumns(timeIndex, keyCode, isAdjustBill, schema.horizontalBodyValues));
				}
			});
		} else {
			// 如果不存在横向展开维度，则表头是两行的情况
			columns.forEach((item, timeIndex) => {
				if (item.children) {
					item.children = item.children.concat(getFinalColumns(timeIndex, keyCode, isAdjustBill));
				}
			})
		}
	}

	// 纵向展开的维度放到columns中
	const fileTypeMap = {
		Department: 'department',
		DisburseClass: 'disburse',
		ExpenseItem: 'project',
	};
	schema.verticalBody = _.sortBy(schema.verticalBody, ['showOrder']);
	schema.verticalBody.forEach((item) => {
		temp = _.cloneDeep(leftColTpl);
		temp.title = item.dimensionRef.dimension.name;
		temp.dataIndex = item.dimensionRef.item_code;
		temp.key = item.dimensionRef.item_code;
		// temp.width = 170;
		temp.dataType = {
			type: 'file',
			fileType: fileTypeMap[item.dimensionRef.dimension.code],//根据 item.dimensionRef.dimension.code 来对应 需要构建一个常量Map来匹配
			isRadio: true,
			isDummy: true,
		};
		columns.unshift(temp);
		addDataTemp = Object.assign(addDataTemp, {[item.dimensionRef.item_code]: null});
		scrollX += leftColWidth;
	});
	console.log('表头定义', columns, '增加对象模板', addDataTemp, 'scrollX', scrollX);
	return {columns, addDataTemp, scrollX};
};

/**
 * 根据schema fieldDefine生成可编辑行
 * {label: '动态字段', code: '动态code', type: 'commonChoose', fileType: 'staff',}
 *
 * inputType对应关系
 *
 *<!-- 档案 人员,部门,支出类型,项目,外部人员,银行档案,供应商档案-->
 <div ng-if="[11, 14, 15, 25, 26, 30, 31, 32,35,'billTypes','companies','expenseList'].indexOf(fieldSchema.inputType) !== -1">
 *<!-- 数值 金额 天数-->
 <div ng-if="[7,8,28,'8'].indexOf(fieldSchema.inputType) !== -1">
 <!-- 文本 事由-->
 <div ng-if="[1, 2,17].indexOf(fieldSchema.inputType) !== -1">
 <!-- 单选下拉 舱位席别-->
 <div ng-if="[4,10].indexOf(fieldSchema.inputType) !== -1">
 <!--  公司 国家 城市-->
 <div ng-if="[5,6,22,'Query'].indexOf(fieldSchema.inputType) !== -1">
 <!-- 日历 月份选择 -->
 <div ng-if="[3,9,27].indexOf(fieldSchema.inputType) !== -1">
 <!-- 布尔类型 -->
 <div ng-if="[12].indexOf(fieldSchema.inputType) !== -1">
 <!-- 自定义档案 -->
 <div ng-if="[20].indexOf(fieldSchema.inputType) !== -1">
 <!--  申请单报销单跨公司选人和项目 -->
 <div ng-if="['appAndReimQuery'].indexOf(fieldSchema.inputType) !== -1">
 */
export const generateEditForms = (fieldDefine, canEdit) => {
	canEdit = canEdit === undefined ? true : canEdit;
	let arr = [];
	if (Object.prototype.toString.call(fieldDefine) !== '[Object Array]') {
		console.error('fieldDefine应该是数组');
		return false;
	} else {
		for (let field of fieldDefine) {
			if (field.visible) {//是否显示
				const inputType = field.inputType;
				const label = field.name;
				const code = field.code;
				let type = '';
				let fileType = '';
				let step = '0.01';
				let isRadio = true;
				let radioReturnObj = true;
				let showGroup = false;
				const isnull = field.isnull;
				const disabled = !field.editable;
				const order = field.order;

				if ([11, 14, 15, 25, 26, 30, 31, 32, 35, 23, 6, 4, 22].indexOf(inputType) !== -1) {//是档案 那么type是commonChoose
					type = 'commonChoose';
					fileType = inputTypesMap[inputType];
				} else if ([7, 8, 28, '8'].indexOf(inputType) !== -1) {
					type = 'inputNumber';
					step = '0.01';
				} else if ([1, 2, 17].indexOf(inputType) !== -1) {
					type = 'input';
				} else if ([3, 9, 27].indexOf(inputType) !== -1) {
					type = 'date';
				} else if ([12].indexOf(inputType) !== -1) {
					type = 'switch';
				}
				arr.push({
					label,
					code,
					type,
					fileType,
					isRadio,
					radioReturnObj,
					showGroup,
					isnull,
					disabled,
					step,
					order,
					canEdit
				})
			}
		}
		// 排序
		arr = _.sortBy(arr, ['order']);
		// 三个栏目一行 需要拆分一下
		arr = _.chunk(arr, 3);
	}
	return arr;
};

/**
 * 单据提交校验
 * @param schema
 * @param model
 * @return {boolean}
 */
export const valid = (schema, model) => {
	let result = true;
	let hasEndTime = false;
	let hasStartTime = false;
	schema.forEach((field) => {
		let obj = model[field.code];
		if (field.code === 'endTime' && field.visible) {
			hasEndTime = true;
		}
		if (field.code === 'startTime' && field.visible) {
			hasStartTime = true;
		}
		if (result && field.visible && !field.isnull && ( obj === null || obj === undefined || obj === '' || (obj.hasOwnProperty('id') && obj['id'] === null))) {
			result = false;
			Toast.error('请输入数据项:' + field.name);
		}
	});
	// 结束日期开始日期同时存在时,校验
	if (result && hasStartTime && hasEndTime) {
		if (model['startTime'] > model['endTime']) {
			result = false;
			Toast.error('结束日期不能小于开始日期');
		}
	}
	return result;
};