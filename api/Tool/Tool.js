//获取应用实例
const app = getApp();
/**
 * 药品重新分组
 */
function groupDrugModelArray(dataSource) {
  //1、药品数组组号去空
  dealTempleteGroupNo(dataSource);
  //2、根据组号进行升序
  sortTempleteModelFromGroupNo(dataSource);
  //3、收集组号
  var numberArray = collectGroupNo(dataSource);
  //4、重新划分分组
  var resultArray = addNewSectionArray(dataSource, numberArray);
  return resultArray;
}

/**
 * 药品数组组号去空
 */
function dealTempleteGroupNo(dataSource){
  for (let i = 0; i < dataSource.length; i++) {
    var drugJson = dataSource[i];
    if (parseInt(drugJson.group_no) == 0){
       drugJson.group_no = 1;
    }
  }
}

/**
 * 根据组号进行升序
 */
function sortTempleteModelFromGroupNo(dataSource){
  dataSource.sort(function(obj1,obj2){
    var firstNumber = parseInt(obj1.group_no);
    var secondNumber = parseInt(obj2.group_no);
    if (firstNumber < secondNumber){
       return -1;
    }
    if (firstNumber > secondNumber){
       return 1;  
    }
    return 0;
  });
}

/**
 * 收集组号
 */
function collectGroupNo(dataSource){
  var numberArray = [];
  //1、收集组号
  for (let i = 0; i < dataSource.length; i++) {
    var drugJson = dataSource[i];
    numberArray.push(drugJson.group_no);
  }
  //2、组号去重
  return Array.from(new Set(numberArray));
}

/**
 * 重新划分分组
 */
function addNewSectionArray(dataSource, numberArray){
  var resultArray = [];//总的数组
  for (let i = 0; i < numberArray.length; i++) {
    var number = numberArray[i];//组号
    var sectionArray = [];//分组
    for (let j = 0; j < dataSource.length; j++) {
      var model = dataSource[j];
      if(parseInt(number) == parseInt(model.group_no)){//组号相同
        sectionArray.push(model);
      }
    }
    resultArray.push(sectionArray);
  }
  return resultArray;
}

/**
 * 处理组号显示问题
 */
function dealtDrugModelGroupNo(dataSource){
  var resultArray = [];
  //1、处理组号是否显示
  for (let i = 0; i < dataSource.length; i++) {
    var sectionArray = dataSource[i];
    for (let j = 0; j < sectionArray.length; j++) {
      var jsonModel = sectionArray[j];
      jsonModel.isShowGroupNo = (j == 0) ? true : false;
    }
  }
  //2、处理每组中药和医疗器械混合的情况(中药永远在最后面)
  for (let i = 0; i < dataSource.length; i++) {
    var sectionArray = dataSource[i];
    if (judgeIsChineseDrugAndInstrument(sectionArray)) {//中药和医疗器械混合
      splitInstrumentAndChineseDrug(sectionArray);
    }
  }
  //3、处理顶部和底部白色边框是否显示
  for (let i = 0; i < dataSource.length; i++){
    var tempArray = dataSource[i];
    //3.1、先统一处理
    for (let j = 0; j < tempArray.length; j++){
      var tempJsonModel = tempArray[j];
      tempJsonModel.isShowTop = false;
      tempJsonModel.isShowBottom = false;
    }
    //3.2、每组第一个、显示顶部栏
    var firstDrugModel = tempArray[0];
    firstDrugModel.isShowTop = true;
    //3.3、每组最后一个、显示底部栏
    var lastDrugModel = tempArray[tempArray.length - 1];
    lastDrugModel.isShowBottom = true;
  }
  //4、转化为一维数组
  for (let i = 0; i < dataSource.length; i++) {
    var sectionArray = dataSource[i];
    
    for (let j = 0; j < sectionArray.length; j++) {
      var model = sectionArray[j];
      resultArray.push(model);
    }
  }
  return resultArray;
}

/**
 * 判断是否有中药和医疗器械
 */
function judgeIsChineseDrugAndInstrument(sectionArray){
  var isMix = false;
  var chineseDrugCount = 0;
  //1、循环遍历
  for (let i = 0; i < sectionArray.length; i++) {
    var modelJson = sectionArray[i];
    var dugType = parseInt(modelJson.dug_type.id);
    if (dugType == 3){//中药
      chineseDrugCount ++;
    }
  }
  //2、判断是否混合
  if ((chineseDrugCount == sectionArray.length) || (chineseDrugCount == 0)) {//全是中药、一个中药都没有
    isMix = false;
  }
  else{
    isMix = true;
  }
  return isMix;
}

/**
 * 中药和医疗器械分开
 */
function splitInstrumentAndChineseDrug(sectionArray){
  var instrumentArray = [];
  var chineseArray = [];
  //1、分开
  for (let i = 0; i < sectionArray.length; i++)
  {
    var westDrugModel = sectionArray[i];
    if (parseInt(westDrugModel.dug_type.id) == 3){//中药
      chineseArray.push(westDrugModel);
    }else
    {//医疗器械
      instrumentArray.push(westDrugModel);
    }
  }
  //2、将中药放置在最后
  sectionArray = [];
  sectionArray = sectionArray.concat(instrumentArray);
  sectionArray = sectionArray.concat(chineseArray);
  //3、处理当前组组号显示问题
  for (let i = 0; i < sectionArray.length; i++)
  {
    var westDrugModel = sectionArray[i];
    if (i == 0) {
      westDrugModel.isShowGroupNo = true;
    }
    else {
      westDrugModel.isShowGroupNo = false;
    }
  }
}

/**
 * 处理西药组件展示内容
 */
function dealWestComponentShow(dataSource){
  for (let i = 0; i < dataSource.length; i++) {
    var model = dataSource[i];
    //组号
    model.groupNo = model.group_no;
    //图片
    dealImageShow(model);
    //通用名
    model.generalName = model.general_name;
    //批次
    model.batch = model.expire_date;
    //规格(字段一致)
    //用法
    dealUsage(model);
    //生产厂商
    model.manufacturer = model.manufacturer.key_name;
    //价格(字段一致)(暂时不考虑价格开关)
    //数目
    dealCount(model);
    //是否显示组号
    model.isHiddenGroupNo = !model.isShowGroupNo;
  }
}

/**
 * 处理中药组件显示
 */
function dealChineseComponentShow(dataSource) {
  for (let i = 0; i < dataSource.length; i++) {
    var model = dataSource[i];
    if (parseInt(model.dug_type.id) == 4) {//医疗器械
      //组号        
      model.groupNo = model.group_no;
      //图片
      dealImageShow(model);
      //通用名
      model.generalName = model.general_name;
      //批次
      model.batch = model.expire_date
      //规格(字段一致)
      //数目
      model.count = model.total + model.unit.key_name;
      //是否隐藏组号
      model.isHiddenGroupNo = !model.isShowGroupNo;
    }
    else {//中药
      //组号
      model.groupNo = model.group_no;
      //图片
      dealImageShow(model);
      //通用名(这里要特殊处理)(暂时不处理)
      model.generalName = model.general_name;
      //规格(字段一致)(本来应该展示批次)(暂时不处理)
      model.spec = '';
      //数目(也需要特殊处理)
      model.count = model.total + model.unit.key_name;
      //展示用法
      //每日用量
      var singleUse = '每' + model.sig_day + '日' + model.day_agent + '剂/贴';
      //用药天数
      var dayCount = '用药' + model.day_count + '天';
      //药品总量
      var drugCount = '共' + model.total_agent + '剂/贴';
      //服用方法
      var takingString = model.instruction.key_name;
      model.drugUsage = singleUse + '' + dayCount + '' + drugCount + ' ' + takingString;
      //是否显示组号
      model.isHiddenGroupNo = !model.isShowGroupNo;
    }
  }
}

/**
 * 处理图片展示
 */
function dealImageShow(model){
  if(model.image){//有图片
    //由于返回结果问题、需要处理一下
    if (model.image[0].key_name.indexOf("http") == -1){//不包含http字段
      model.imageURL = model.image[0].url + '&_userid=' + app.globalData.userId + '&_password=' + app.globalData.password;
    }
    else{
      model.imageURL = model.image[0].key_name + '&_userid=' + app.globalData.userId + '&_password=' + app.globalData.password;
      
    }
    model.isDefaultImage = false;
  }
  else{//无图片
    model.isDefaultImage = true;
  }
}

/**
 * 处理西药用法
 */
function dealUsage(model){
  if (parseInt(model.dug_type.id) == 4) {//医疗器械(不展示用法)
    model.usage = "";
    model.isHiddenUsage = true;
  }
  else {//西药或中成药
    //用法
    var instruction = model.instruction.key_name;
    //每日几次
    var day_type = model.day_type.key_name;
    //每次用量
    var single_use = '';
    if (parseFloat(single_use) < 0){
      single_use = "每次适量";
    }else{
      single_use = '每次' + model.single_use + model.single_unit.key_name;
    }
    //用药天数
    var day_count = '用药' + model.day_count + '天';
    //服用方法
    model.usage = instruction + day_type + single_use + day_count;
    model.isHiddenUsage = false;
  } 
}

/**
 * 处理数目
 */
function dealCount(model){
  if (model.unit){//判断单位字段是否存在
    model.count = model.total + model.unit.key_name;
  }else{
    model.count = model.total;
  }
}

/**
 * 对外接口
 */
module.exports = {
  groupDrugModelArray: groupDrugModelArray,
  dealtDrugModelGroupNo: dealtDrugModelGroupNo,
  dealWestComponentShow: dealWestComponentShow,
  dealChineseComponentShow: dealChineseComponentShow
}