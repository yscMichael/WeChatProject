//app.js
//md5
const md5 = require('/utils/md5.js');


App({
  onLaunch: function () {

  },
  
  globalData: {
    username: "lxr001",
    password: md5.hexMD5('123456'),
    reportBoss:null,//是否是管理员
    medical_add:null,//是否有开药权限
    medical_fee:null,//是否有收费权限
    medical_send:null,//是否有发药权限
    is_inventory:null,//是否使用库存
    is_price:null,//是否使用价格
    local_state:null,//出入库是否审核权限
    print_price:null,//是否打印处方价格
    print_retail_price:null,//是否打印售药单价格
    print_extra_charge:null,//是否打印附加费
    local_add: null,//采购入库是否能添加药品
    key_name:null,//医生名字
    department_entity:null,//诊所名字
    departmentId: null,
    userId: null,
    commonURl:'https://jqapi.hao1bao.com',
    imageURL: 'https://jqfile.hao1bao.com'

    // commonURl: 'http://172.18.5.158:8080',
    // imageURL: 'http://172.18.5.158:8080'
    // commonURl: 'http://172.18.5.155:8090',
    // imageURL: 'http://172.18.5.155:8090'
  }
})