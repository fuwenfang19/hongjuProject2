//维度变量对应
export const fileTypeDimCode = {
  'dim_one':'project',
  'dim_two':'department',
  'dim_three':'disburse',
  'dim_four':'staff',
  'dim_five':'fundSource',
}
export const budgetPlanDetail_template = {
     "id": '',            //pk,方案id
     "code": "",	//方案code
    "name": "",	//方案name
    "startDimensionRef": {  //开始维度定义，默认为支出类型
        "id": 4, //维度定义id
        "item_code": "dim_three",   //维度字段
        "dimension": {   //维度
            "id": 2,
            "code": "DisburseClass",  //维度类型
            "name": "支出类型"  //维度名称
        }
    },
    "startDimValue": {   //起始维度值（支出类型值）
        "name": "",  //起始维度名称（支出类型值）
        "id": ''   //起始维度值（支出类型值）
    },
    "status": 0,  //状态（0:正常；1：停用
    "creater": {  //编制人
        "id": 707,
        "code": "0000043716",
        "name": "王威"
    },
    "createTime": "2017-05-23",
    "dimensionRefs": [    //其他引用的维度
    ],
    "dims": [//预算控制方案明细列表
        {
            "id": '',
            "controlItemPlan": {//预算控制方案明细维度
                "id": 2,
                "group": 1,
                "company": 3,
                "dim_one": 0,
                "dim_oneName": null,
                "dim_two": 0,
                "dim_twoName": null,
                "dim_three": 0,
                "dim_threeName": null,
                "dim_four": 0,
                "dim_fourName": null,
                "dim_five": 0,
                "dim_fiveName": null,
                "dim_six": 0,
                "dim_sixName": null,
                "dim_seven": 0,
                "dim_sevenName": null,
                "dim_eight": 0,
                "dim_eightName": null,
                "dim_nine": 0,
                "dim_nineName": null,
                "dim_ten": 0,
                "dim_tenName": null,
                "budgetYear": 0,
                "hindex": "f19171efe47c917b9f12bcf8ea7afd90",
                "kind": 0, //预算类型 0 - 年度预算 1 - 自定义期间(可跨年)
                "startDate": "2017-01-01",
                "endDate": "2017-12-31",
                "createTime": "2017-05-23T13:41:18.905014",
                "lastUpdate": "2017-05-23T13:41:18.905051",
                "budgetConfigPlan": 4
            },
            "group": 1,
            "company": 3,
            "kind": 0,  //期间类型(0:全年,1:半年,2:季度,3:月份,4:自定义期间)
            "startDate": null,   //自定义期间开始日期
            "endDate": null,    //自定义期间结束日期
            "controlKind": 0,   //控制期间(0:全年,1:半年,2:季度,3:月份,4:全部自定义期间,(5:自定义期间))
            "controlLevel": 1,  //控制要求(0:记录;1:提醒;2:弹性;3:刚性)
            "warnLimit": "100.000000", //提前提醒的比例
            "controlLimit": "100.000000",  //提前控制的比例
            "overageKind": 3,  //累计规则-(0:按月初累计,1:按季初累计,2:按半年初累计,3:按年初累计,4:按整个自定义期间初累计,(5:按单个自定义期间初))
            "createTime": "2017-05-23T13:41:18.914430",
            "lastUpdate": "2017-05-23T13:41:18.914721",
            "budgetConfigPlan": 4          //预算控制方案
        }
    ]
}

export const budgetColumn_template =[{
    title: '控制方式',
    dataIndex: 'controlLevel',
    key: 'controlLevel',
    width:100,
    dataType: {
      type: 'select',
      selectList: [
        {
          name: '记录',
          value: 0
        }, {
          name: '提醒',
          value: 1
        }, {
          name: '弹性',
          value: 2
        },{
          name: '刚性',
          value: 3
        }
      ]
    }
  }, {
    title: '控制期间类型',
    dataIndex: 'controlKind',
    key: 'controlKind',
    width:200,
    dataType: {
      type: 'customRangeType',
    }
  }, {
    title: '预算累计周期',
    dataIndex: 'overageKind',
    key: 'overageKind',
    width:200,
    dataType: {
      type: 'select',
      selectList: [
        {
          name: '按月初累计',
          value: 0
        }, {
          name: '按季初累计',
          value: 1
        }, {
          name: '按半年初累计',
          value: 2
        },{
          name: '按年初累计',
          value: 3
        },{
          name: '按整个自定义期间初累计',
          value: 4
        },{
          name: '按单个自定义期间初',
          value: 5
        }
      ]
    }
  }, {
    title: '预警百分比',
    dataIndex: 'warnLimit',
    key: 'warnLimit',
    width:100,
    dataType:{
      type:'numberPercent'
    }
  }, {
    title: '控制百分比',
    dataIndex: 'controlLimit',
    key: 'controlLimit',
    width:100,
    dataType:{
      type:'numberPercent'
    }
  }]