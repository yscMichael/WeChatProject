//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 患者列表请求数据
 */
function loadPatientListData(keyword, page, rows, onSuccess, onFail) {
  var params = {
    page: page,
    rows: rows,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page&cloud=patient', params,
    function (success) {
      //总数赋值
      var totalCount = success.data.total;
      //解析模型数据
      onSuccess(convertToPatientListModel(success), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 转诊列表请求数据
 */
function loadTreatListData(keyword, page, rows, onSuccess, onFail) {
  var params = {
    page: page,
    rows: rows,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/treatment/transfer?&op=getPageList&review_state=1,3', params,
    function (success) {
      //总数赋值
      var totalCount = success.data.total;
      //解析模型数据
      onSuccess(convertToTreatListModel(success), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 患者列表模型转换
 */
function convertToPatientListModel(success) {
  //1、临时数组
  var tempArray = [];
  //2、遍历获取标题、详情url、当前图片地址
  var rows = success.data.rows;
  for (let i = 0; i < rows.length; i++) {
    //模型声明
    var patientModel = {
      name: '',//姓名
      gender: '',//性别
      age: '',//年龄
      imageSex: '',//性别图片
      time: '',//时间
      detail: '',//联系方式
    };
    var tempJson = rows[i];
    //姓名
    patientModel.name = tempJson.key_name;
    //性别
    patientModel.gender = tempJson.gender.key_name;
    //年龄
    patientModel.age = dealPatientAge(tempJson);//特殊处理
    //性别图片
    patientModel.imageSex = dealPatientSexImage(tempJson);//特殊处理
    //时间
    patientModel.time = tempJson.create_time;
    //诊断
    patientModel.detail = tempJson.mobile;
    //添加到数组
    tempArray.push(patientModel);
  }
  return tempArray;
}

/**
 * 转诊列表模型转换
 */
function convertToTreatListModel(success) {
  //1、临时数组
  var tempArray = [];
  //2、遍历获取标题、详情url、当前图片地址
  var rows = success.data.rows;
  for (let i = 0; i < rows.length; i++) {
    //模型声明
    var treatModel = {
      name: '',//姓名
      gender: '',//性别
      age: '',//年龄
      imageSex: '',//性别图片
      time: '',//时间
      detail: '',//联系方式
    };
    var tempJson = rows[i];
    //姓名
    treatModel.name = tempJson.patient_name;
    //性别
    treatModel.gender = (parseInt(tempJson.gender) == 1) ? "男":"女";
    //年龄
    treatModel.age = dealTreatAge(tempJson);//特殊处理
    //性别图片
    treatModel.imageSex = dealTreatSexImage(tempJson);//特殊处理
    //时间
    treatModel.time = tempJson.create_time;
    //诊断
    treatModel.detail = tempJson.mobile;
    //添加到数组
    tempArray.push(treatModel);
  }
  return tempArray;
}

/**
 * 处理患者列表年龄
 */
function dealPatientAge(tempJson) {
  var age = '';
  if ((parseInt(tempJson.age) == 0) && (parseInt(tempJson.month) == 0)) {//年月都为0
    age = "新生儿";
  }
  else {//展示年月
    if (parseInt(tempJson.age) == 0){
      age = ' ' + tempJson.gender.key_name + ' ' + tempJson.month + '月 ';
    }
    else{
      age = ' ' + tempJson.gender.key_name + ' ' + tempJson.age + '岁 ';
    }
  }
  return age;
}

/**
 * 处理转诊转折年龄
 */
function dealTreatAge(tempJson) {
  var age = '';
  var gender = (parseInt(tempJson.gender) == 1) ? "男" : "女";
  if ((parseInt(tempJson.age) == 0) && (parseInt(tempJson.month) == 0)) {//年月都为0
    age = "新生儿";
  }
  else {//展示年月
    if (parseInt(tempJson.age) == 0) {
      age = ' ' + gender + ' ' + tempJson.month + '月 ';
    }
    else {
      age = ' ' + gender + ' ' + tempJson.age + '岁 ';
    }
  }
  return age;
}

/**
 * 根据患者状态处理照片
 */
function dealPatientSexImage(tempJson) {
  if (tempJson.gender.key_name.indexOf("男") != -1){//男
    return "/image/clinic/man.png";
  }
  else{//女
    return "/image/clinic/woman.png";
  }
}

/**
 * 根据患者列表状态处理照片
 */
function dealTreatSexImage(tempJson) {
  var gender = (parseInt(tempJson.gender) == 1) ? "男" : "女";
  if (gender.indexOf("男") != -1) {//男
    return "/image/clinic/man.png";
  }
  else {//女
    return "/image/clinic/woman.png";
  }
}

/**
 * 对外接口
 */
module.exports = {
  loadPatientListData: loadPatientListData,
  loadTreatListData: loadTreatListData
}