//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 待发药
 */
function loadUnSendDataListData(keyword, page, rows, onSuccess, onFail) {
  var params = {
    page: page,
    rows: rows,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page&cloud=medical_record[unsend]&sort=handle_time&order=asc', params,
    function (success) {
      //总数赋值
      var totalCount = success.data.total;
      //解析模型数据
      onSuccess(convertToSendListModel(success), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 已发药
 */
function loadSendedDataListData(keyword, page, rows, onSuccess, onFail) {
  var params = {
    page: page,
    rows: rows,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page&cloud=medical_record[send]&sort=send_date&order=desc', params,
    function (success) {
      //总数赋值
      var totalCount = success.data.total;
      //解析模型数据
      onSuccess(convertToSendListModel(success), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 转换为收费模型
 */
function convertToSendListModel(success) {
  //1、临时数组
  var tempArray = [];
  //2、遍历获取标题、详情url、当前图片地址
  var rows = success.data.rows;
  for (let i = 0; i < rows.length; i++) {
    //模型声明
    var sendModel = {
      id: '',//id
      name: '',//姓名
      gender: '',//性别
      age: '',//年龄
      money: '',//价格
      time: '',//时间
      detail: '',//诊断
    };
    var tempJson = rows[i];
    //id
    sendModel.id = tempJson.id;
    //姓名
    sendModel.name = (tempJson.patient_name.length === 0) ?
      tempJson.patient_id.key_name : tempJson.patient_name;
    //性别
    sendModel.gender = tempJson.patient_gender.key_name;
    //年龄
    sendModel.age = dealSendListAge(tempJson);//特殊处理
    //价格
    sendModel.money = tempJson.pay_price;
    //时间
    sendModel.time = tempJson.handle_time;
    //诊断
    sendModel.detail = tempJson.doctor_say;
    //添加到数组
    tempArray.push(sendModel);
  }
  return tempArray;
}

/**
 * 处理收费列表年龄
 */
function dealSendListAge(tempJson) {
  var age = '';
  if ((parseInt(tempJson.age) == 0) && (parseInt(tempJson.month) == 0)) {//年月都为0
    if (typeof (tempJson.patient_day) == "undefined") {
      age = ' ' + tempJson.patient_gender.key_name + ' ' + '0天' + ' ';
    }
    else{
      age = ' ' + tempJson.patient_gender.key_name + '' + tempJson.patient_day + '天 ';
    }  
  }
  else {//展示年月
    age = ' ' + tempJson.patient_gender.key_name + ' ' + tempJson.age + '岁' + tempJson.month + '月 ';
  }
  return age;
}

/**
 * 对外接口
 */
module.exports = {
  loadUnSendDataListData: loadUnSendDataListData,
  loadSendedDataListData: loadSendedDataListData
}

