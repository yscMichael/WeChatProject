//获取应用实例
const app = getApp()

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
  getRequest: getRequest
}