//获取应用实例
const app = getApp()
var utilJs = require('../utils/util.js');

/**
 * post请求
 */
function postRequest(url, params, onSuccess, onFail){
  request(url, params, "POST", onSuccess, onFail);
}

/**
 * get请求
 */
function getRequest(url, params, onSuccess, onFail){
  request(url, params, "GET", onSuccess, onFail);
}

/**
 * 根据药品条形码查询第三方药品信息
 */
function loadDrugInfoWithCode(code, onSuccess, onFail){
  var key = '5fa59e9d68bb357dd3ce5187174df6a1';
  var url = 'https://api.3023data.com/barcode/barcode?barcode=' + code;
  wx.request({
    url: url,
    header: {'key': key},//请求头
    method: "GET",
    dataType: 'json',//返回数据格式
    success: function (res) {
      onSuccess(res);
    },
    fail: function (error) {
      onFail(error);
    },
    complete: function (res) {
      console.log('完成-------');
    },
  }) 
}

/**
 * 上传图片信息
 */
function upLoadImage(filePath, onSuccess, onFail){
  //1、开发者服务器地址
  var url = app.globalData.imageURL + '/app?op=Upload';
  //2、文件地址
  var imagePath = filePath;
  //3、额外参数
  var formData = {
    _userid: app.globalData.userId,
    _password: app.globalData.password
  };
  //4、网络请求参数
  wx.uploadFile({
    url: url,//服务器
    filePath: imagePath,//文件地址
    name: 'filename',//二进制key
    formData: formData,//额外参数
    header: {'content-type': 'multipart/form-data'},
    success(res){
      console.log('图片--------------');
      console.log(res);
      var resultData = JSON.parse(res.data);
      console.log(resultData);
      if(resultData.code == 200){
        var key_name = resultData.data ? resultData.data.key_name : '';
        onSuccess(key_name);
      }else{
        onFail('图片上传失败');
      }
    }
  })
}

/**
 * 网络请求封装
 * @url 请求地址
 * @params 参数
 * @method 请求方式
 * @onSuccess 成功回调
 * @onFail 失败回调
 */
function request(url, params, method, onSuccess, onFail){
  wx.request({
    url: app.globalData.commonURl + url,
    data: params,
    header: { 'content-type': 'application/json'},//请求头
    method: method,
    dataType: 'json',//返回数据格式
    //responseType: 'json',//响应数据类型
    success: function (res) {
      onSuccess(res);
    },
    fail: function (error) {
      onFail(error);
    },
    complete: function (res) {
      console.log('完成-------');
    },
  })
}

/**
 * 对外接口
 */
module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  loadDrugInfoWithCode: loadDrugInfoWithCode,
  upLoadImage: upLoadImage
}