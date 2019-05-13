
//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 登陆请求接口
 */
function loginRequest(userName, password,onSuccess, onFail) { 
  var params = {
    op: "Login",
    subname: "gmi",
    username: app.globalData.username,
    password: app.globalData.password,
    push_channel: "",
    appos: "4",
  }
  netJs.getRequest('/sys',params,function(success){
    //是否是管理员
    app.globalData.reportBoss = success.data.data.rights.report_boss == 1 ? true : false,
    //是否有开药权限
    app.globalData.medical_add = success.data.data.rights.medical_add == 1 ? true : false,
    //是否有收费权限
    app.globalData.medical_fee = success.data.data.rights.medical_fee == 1 ? true : false,
    //是否有发药权限
    app.globalData.medical_send = success.data.data.rights.medical_send == 1 ? true : false,
    //是否使用库存
    app.globalData.is_inventory = success.data.data.rights.is_inventory == 1 ? true : false,
    //是否使用价格
    app.globalData.is_price = success.data.data.rights.is_price == 1 ? true : false,
    //出入库是否审核权限
    app.globalData.local_state = success.data.data.rights.local_state == 1 ? true : false,
    //是否打印处方价格
    app.globalData.print_price = success.data.data.rights.print_price == 1 ? true : false,
    //是否打印售药单价格
    app.globalData.print_retail_price = success.data.data.rights.print_retail_price == 1 ? true : false,
    //是否打印附加费
    app.globalData.print_extra_charge = success.data.data.rights.print_extra_charge == 1 ? true : false,
    //医生名字
    app.globalData.key_name = success.data.data.key_name,
    //诊所名字
    app.globalData.department_entity = success.data.data.department_entity,
    //存储departmentId
    app.globalData.departmentId = success.data.data.department_entity_id;
    //存储userId
    app.globalData.userId = success.data.data.id;
    onSuccess(success);
  },
  function(fail){
    onFail(fail);
  });
}

/**
 * 对外接口
 */
module.exports = {
  loginRequest: loginRequest
}