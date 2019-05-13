//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 请求初始化数据
 */
function loadInitData(onSuccess, onFail) {
  var params = {
    id: app.globalData.departmentId,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=List&cloud=department[clinic]', params,
    function (success) {
      var tempDict = success.data.rows[0];
      onSuccess(dealResult(tempDict));
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 改变初始设置状态
 */
function changeInitData(paramDict,onSuccess, onFail) {
  var params = {
    is_inventory: paramDict.is_inventory,
    is_price: paramDict.is_price,
    is_sure: paramDict.is_sure,
    print_extra_charge: paramDict.print_extra_charge,
    print_price: paramDict.print_price,
    print_retail_price: paramDict.print_retail_price,
    id: app.globalData.departmentId,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Modify&cloud=department[clinic]', params,
    function (success) {
      onSuccess();
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 处理返回结果
 */
function dealResult(tempDict){
  var resultDict = {
    is_inventory:'',
    is_price:'',
    print_price:'',
    print_extra_charge:'',
    is_sure:'',
    print_retail_price:''
  };
  // 是否开启库存
  resultDict.is_inventory = tempDict.is_inventory.id;
  // 是否使用药品价格
  resultDict.is_price = tempDict.is_price.id;
  // 是否打印处方总价
  resultDict.print_price = tempDict.print_price.id;
  // 是否打印附加费
  resultDict.print_extra_charge = tempDict.print_extra_charge.id;
  // 出入库是否审核
  resultDict.is_sure = tempDict.is_sure.id;
  // 是否打印售药单总价
  resultDict.print_retail_price = tempDict.print_retail_price.id;

  return resultDict;
}

/**
 * 对外接口
 */
module.exports = {
  loadInitData: loadInitData,
  changeInitData: changeInitData
}