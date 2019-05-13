//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 轮播图请求接口
 */
function loadScrollViewRequest(onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=List&cloud=activity_mng&activity_type=1&query_type=1',params,
  function(success){
    onSuccess(convertToScrollModel(success));
  },
  function(fail){
    onFail(fail);
  });
}

/**
 * 轮播图模型转换
 */
function convertToScrollModel(success){
  //1、临时数组
  var tempArray = [];
  //2、遍历获取标题、详情url、当前图片地址
  var rows = success.data.rows;
  for (let i = 0; i < rows.length; i++) {
    var scrollModel = {
      key_name: '',//轮播图详情标题
      url: '',//轮播图详情url
      imageUrl: ''//轮播图当前图片地址
    };

    var tempJson = rows[i];
    //详情名称
    scrollModel.key_name = tempJson.key_name;
    //详情地址
    scrollModel.url = tempJson.url;
    //图片地址
    var imgJson = tempJson.app_img[0];
    scrollModel.imageUrl = imgJson.url + '&_password=' +
      app.globalData.password + '&_userid=' + app.globalData.userId;
    //添加到数组
    tempArray.push(scrollModel);
  }
  return tempArray;
}

/**
 * 门诊数据请求
 */


/**
 * 有效期预警请求
 */


/**
 * 库存预警请求
 */



/**
 * 对外接口
 */
module.exports = {
  loadScrollViewRequest: loadScrollViewRequest
}