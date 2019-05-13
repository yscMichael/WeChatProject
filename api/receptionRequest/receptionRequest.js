//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 接诊列表请求数据
 */
function loadReceptionListData(keyword, page, rows, onSuccess, onFail){
  var params = {
    page: page,
    rows: rows,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page&cloud=medical_record&review_state=0,1,3,4,5,7&sort=handle_time&order=desc', params,
    function (success) {
      //总数赋值
      var totalCount = success.data.total;
      //解析模型数据
      onSuccess(convertToReceptionListModel(success), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 加载患者信息
 */
function loadMedicalRecordData(recordId, onSuccess, onFail){
  var params = {
    id: recordId,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Get&cloud=medical_record', params,
    function (success) {
      //直接返回、不用做模型转换
      onSuccess(success.data.data);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 加载处方信息
 */
function loadPrescriptionData(cloudName, entityId, onSuccess, onFail){
  var params = {
    cloud: cloudName,
    medical_entity: entityId,
    page:1,
    rows:1000,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page', params,
    function (success) {
      //直接返回、不用做模型转换
      onSuccess(success.data.rows);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 加载附加费用
 */
function loadMedicalChargeData(chargeType, entityId, onSuccess, onFail){
  var params = {
    op: 'Page',
    cloud: chargeType,
    medical_entity: entityId,
    page: 1,
    rows: 1000,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?', params,
    function (success) {
      //直接返回、不用做模型转换
      onSuccess(success.data.rows);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 接诊列表模型转换
 */
function convertToReceptionListModel(success){
  //1、临时数组
  var tempArray = [];
  //2、遍历获取标题、详情url、当前图片地址
  var rows = success.data.rows;
  for (let i = 0; i < rows.length; i++) {
    //模型声明
    var receptionModel = {
      id:'',//接诊id
      name: '',//姓名
      gender:'',//性别
      age: '',//年龄
      time: '',//时间
      detail: '',//诊断
      imageUrl: ''//状态图片
    };
    var tempJson = rows[i];
    //接诊id
    receptionModel.id = tempJson.id;
    //姓名
    receptionModel.name = (tempJson.patient_name.length == 0) ? 
                          tempJson.patient_id.key_name : tempJson.patient_name;
    //性别
    receptionModel.gender = tempJson.patient_gender.key_name;
    //年龄
    receptionModel.age = dealReceptionAge(tempJson);//特殊处理
    //时间
    receptionModel.time = tempJson.handle_time;
    //诊断
    receptionModel.detail = tempJson.doctor_say;
    //状态图片
    receptionModel.imageUrl = dealStateImage(tempJson);//特殊处理
    //添加到数组
    tempArray.push(receptionModel);
  }
  return tempArray;
}

/**
 * 处理接诊列表年龄
 */
function dealReceptionAge(tempJson){
  var age = '';
  if ((parseInt(tempJson.age) == 0) && (parseInt(tempJson.month) == 0)) {//年月都为0
    if (typeof (tempJson.patient_day) == "undefined") {
      age = ' ' + tempJson.patient_gender.key_name + '' + '0' + '天 ';
    } else {
      age = ' ' + tempJson.patient_gender.key_name + '' + parseInt(tempJson.patient_day) + '天 ';
    }
  }
  else {//展示年月
    age = ' ' + tempJson.patient_gender.key_name + '' + parseInt(tempJson.age) + '岁' + parseInt(tempJson.month) + '月 ';
  }
  return age;
}

/**
 * 根据状态处理照片
 */
function dealStateImage(tempJson){
  var state = parseInt(tempJson.review_state);
  if (state == 5){//已完成
    return "/image/clinic/done.png";
  }
  else if (state == 4){//待发药
    return "/image/clinic/daifayao.png";
  }
  else if (state == 3){//待收费
    return "/image/clinic/daishoufei.png";
  }
  else if (state == 0){//作废
    return "/image/clinic/zuofei.png";
  }
  else if (state == 7) {//已退单
    return "/image/clinic/yituidan.png";
  }
  else{//默认图片
    return "/image/clinic/done.png";
  }
}

/**
 * 处理过敏史
 */
function dealAllergic(model){
  var resultString = '';
  //判断是否有过敏史这个字段
  if (model.patient_allergic){//有过敏史
    for (let i = 0; i < model.patient_allergic.length; i++) {
      var tempJson = model.patient_allergic[i];
      resultString += ',' + tempJson.key_name;
    }
  }
  else{//无过敏史
    resultString = '无';
  }
  return resultString;
}

/**
 * 处理现病史
 */
function dealHeredity(model){
  var resultString = '';
  //判断是否有现病史字段
  if (model.heredity_disease) {//有现病史
    for (let i = 0; i < model.heredity_disease.length; i++) {
      var tempJson = model.heredity_disease[i];
      resultString += ',' + tempJson.key_name;
    }
  }
  else{//无现病史
    resultString = '无';
  }

  return resultString;
}

/**
 * 处理既往史
 */
function dealHistory(model){
  var resultString = '';
  //判断是否有既往史字段
  if (model.history_disease){//有既往史字段
    for (let i = 0; i < model.history_disease.length; i++) {
      var tempJson = model.history_disease[i];
      resultString += ',' + tempJson.key_name;
    }
  }
  else{//无现病史字段
    resultString = '无';
  }
  return resultString;
}

/**
 * 对外接口
 */
module.exports = {
  loadReceptionListData: loadReceptionListData,
  loadMedicalRecordData: loadMedicalRecordData,
  loadPrescriptionData: loadPrescriptionData,
  loadMedicalChargeData: loadMedicalChargeData,
  dealReceptionAge: dealReceptionAge,
  dealAllergic: dealAllergic,
  dealHistory: dealHistory,
  dealHeredity: dealHeredity
}