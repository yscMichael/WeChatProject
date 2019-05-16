//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');
var initJs = require('../initDrugRequest/initDrugRequest.js');

/**
 * 请求仓库列表
 */
function downloadWarehouseRequest(onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=List&cloud=warehouse', params,
  function (success) {
    console.log('请求仓库列表');
    console.log(success);
    var rows = success.data.rows;
    var modelArr = [];
    for (let i = 0; i < rows.length; i++) {
      var drugformDict = rows[i];
      //重新生成模型
      var model = {
        id: drugformDict.id,      //id
        key_name: drugformDict.key_name,  //名称
        is_select: false                  //是否选中
      }
      modelArr.push(model);
    }
    onSuccess(modelArr);
  },
  function (fail) {
    onFail(fail);
  });
}

/**
 * 请求供应商列表
 */
function downloadVendorRequest(onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=List&cloud=vendor', params,
  function (success) {
    console.log('请求供应商列表');
    console.log(success);
    var rows = success.data.rows;
    var modelArr = [];
    for (let i = 0; i < rows.length; i++) {
      var drugformDict = rows[i];
      //重新生成模型
      var model = {
        id: drugformDict.id,      //id
        key_name: drugformDict.key_name,  //名称
        is_select: false                  //是否选中
      }
      modelArr.push(model);
    }
    onSuccess(modelArr);
  },
  function (fail) {
    onFail(fail);
  });
}

/**
 * 根据药品类型请求药品列表
 */
function downloadDrugListRequest(drugtype, page, onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    rows: 15,
    dug_type: drugtype,
    page: page
  }
  netJs.getRequest('/app?op=Page&cloud=drug', params,
  function (success) {
    var drugsArr = success.data.rows;
    var totalCount = success.totalCount;
    //调用药品初始化接口处理数据
    var tempArray = initJs.dealDrugsArrayData(drugsArr);
    onSuccess(tempArray, totalCount);
  },
  function (fail) {
    onFail(fail);
  });
}

/**
 * 根据条形码请求药品信息---0
 */
function loadDrugDataByCode(code, onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    key_word: code,
    page: 1,
    rows: 10
  }
  netJs.getRequest('/app?op=Page&cloud=drug', params,
    function (success) {
      console.log('202状态下获取药品信息');
      var rows = success.data.rows;
      if (rows.length > 0) {//有数据
        //判断review_state
        var model = rows[0];
        var review_state = model.review_state ? model.review_state.id : 0;
        if (review_state == 0) {//已经禁用了
          onFail('该药品已禁用，如需启用，请在电脑端-基础设置菜单修改');
        } else {//处理模型
          //调用药品初始化方法
          var tempArray = initJs.dealDrugsArrayData(rows);
          var firstModel = tempArray[0];
          firstModel.is_select = true;
          onSuccess(firstModel);
        }
      } else {//药品已经禁用
        onFail('检查初始化');
      }
    },
    function (fail) {
      onFail('网络加载失败');
    });
}

/**
 * 检查是否初始化过(根据条形码没有查到药品信息)----1
 * 200:药品已经初始化过、走到说明这里被禁用了
 * 202:该药品在基础库中不存在，是否进行药品初始化？
 */
function checkIsInit(code, onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    uuid: code
  }
  netJs.getRequest('/cloud/prj/gmi/base/api/BaseApi?op=DrugFromBasic', params,
    function (success) {
      console.log('查询是否初始化过');
      console.log(success.data.code);
      var code = success.data.code;
      if ((code == 202) || (code == 200)){
        onSuccess(code);
      }else{
        onFail('网络加载失败');
      }
    },
    function (fail) {
      onFail('网络加载失败');
    });
}

/**
 * 已审核列表
 */
function getStoragedData(page,onSuccess, onFail){
  var params = {
    page: page,
    rows: 15,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page&cloud=pw_bill&sort=modify_time&order=desc&review_state=3', params,
    function (success) {
      var rows = success.data.rows;
      //特殊处理药品名称
      dealDrugName(rows);
      //成功回调
      onSuccess(rows, success.data.total);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 待审核列表
 */
function getStoragingData(page,onSuccess, onFail) {
  var params = {
    page: page,
    rows: 15,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=Page&cloud=pw_bill&sort=modify_time&order=desc&review_state=2', params,
    function (success) {
      var rows = success.data.rows;
      //特殊处理药品名称
      dealDrugName(rows);
      //成功回调
      onSuccess(rows, success.data.total);
    },
    function (fail) {
      onFail(fail);
    });
} 

/**
 * 入库详情
 */
function getPwBillDetail(batchId, onSuccess, onFail){
  var params = {
    pw_bill_id: batchId,
    _userid: app.globalData.userId,
    _password: app.globalData.password
  }
  netJs.getRequest('/app?op=List&cloud=pw_bill_detail', params,
    function (success) {
      var rows = success.data.rows;
      //先处理图片和单位
      dealImageData(rows);
      //成功回调
      onSuccess(rows);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 点击直接入库/提交审核
 */
function submitDrug(listModel, dataSource, onSuccess, onFail) {
  //参数
  var mainParam = submitDrugParam(listModel, dataSource);
  //网络请求
  netJs.getRequest('/app?op=Add&cloud=pw_bill', mainParam,
    function (success) {
      console.log('successsuccesssuccess');
      console.log(success);
      var code = success.data.code;
      if (code == 200) {//提交/审核通过
        onSuccess();
      } else {//提交/审核失败
        var remark = success.data.remark;
        if (remark) {
          onFail(remark);
        } else {
          onFail('网络加载失败');
        }
      }
    },
    function (fail) {
      console.log('failfailfailfailfailfail');
      onFail('网络加载失败');
    });
}

/**
 * 审核通过
 */
function postDrugData(listModel, dataSource, onSuccess, onFail){
  //参数
  var mainParam = dealPostParam(listModel,dataSource);
  //网络请求
  // netJs.getRequest('/app?op=Modify&cloud=pw_bill', mainParam,
  //   function (success) {
  //     var code = success.data.code;
  //     if(code == 200){//审核通过
  //       onSuccess();
  //     }else{//审核失败
  //       onFail();
  //     }
  //   },
  //   function (fail) {
  //     onFail(fail);
  //   });
}



/**
 * 处理直接入库/提交审核
 */
function submitDrugParam(listModel, dataSource){
  //1、主表参数
  var mainParam = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    in_date: listModel.in_date,
    vendor_id: listModel.vendor ? listModel.vendor.id : '',
    warehouse_id: listModel.warehouse ? listModel.warehouse.id : '',
    price: listModel.price,
    cost: listModel.cost,
    review_state: 3,
    discount: 100,
    _subtables: ''//字表
  };
  //2、子表参数
  var subArray = [];
  for (let i = 0; i < dataSource.length; i++) {
    //子表参数模型
    var subDict = {
      op: '',
      vendor_id: '',
      warehouse_id: '',
      total_discount: '',
      cost: '',
      sure_price: '',
      price: '',
      count: '',
      spec: '',
      drug_id: '',
      discount: '100',
      expire_date:'',
      drug_forms: '',
      unit:'',
      general_name: '',
      manufacturer: '',      
      image: '',
      batch_no: '',
    }
    //药品模型
    var model = dataSource[i];
    //子表赋值
    subDict.op = 'Add';
    subDict.warehouse_id = listModel.warehouse ? listModel.warehouse.id : '';
    subDict.vendor_id = listModel.vendor ? listModel.vendor.id : '';
    subDict.drug_id = model.drugId;
    subDict.general_name = model.common_name;
    subDict.dug_type = model.dug_type ? model.dug_type.id : '';
    subDict.spec = model.spec;
    subDict.unit = model.unit ? model.unit.id : '';
    subDict.drug_forms = model.drug_forms ? model.drug_forms.id : '';
    subDict.manufacturer = model.manufacturer ? model.manufacturer.id : '';
    subDict.expire_date = model.expire_date;
    subDict.count = model.count;
    subDict.price = model.price;
    subDict.discount = '100';
    subDict.total_discount = '100';
    subDict.sure_price = model.price * model.count;//小计
    subDict.cost = model.cost;
    if (model.image) {//有图片
      if(model.image.length > 0){
        var imageDict = model.image[0];
        subDict.image = imageDict.key_name;
      }else{
        subDict.image = '';
      }
    }else{
      subDict.image = '';
    }
    subDict.batch_no = model.batch_no;
    //装入数组
    subArray.push(subDict);
  };
  //3、子表参数转换(json字符串)
  var medicineDict = {
    pw_bill_detail: subArray,
  };
  var jsonString = JSON.stringify(medicineDict);
  //4、完善主表参数
  mainParam._subtables = jsonString;
  return mainParam;
}

/**
 * 处理药品名称
 */
function dealDrugName(rows){
  for(let i = 0; i < rows.length; i ++){
    var model = rows[i];
    var tempArray = [];
    var pw_bill_detail = model.pw_bill_detail;
    for (let j = 0; j < pw_bill_detail.length; j ++){
      var tempDict = pw_bill_detail[j];
      tempArray.push(tempDict.general_name);
    }
    //设置特殊字符drugName
    model.drugName = tempArray.join("、");
  }
}

/**
 * 处理已审核和待审核数据
 */
function dealStoragedData(rows){
  //1、收集时间戳
  var allTimeAray = [];
  //1.1、遍历数组
  for(let i = 0; i < rows.length; i ++){
    var model = rows[i];
    var modify_time = model.modify_time;
    var timeArray = modify_time.split(" ");
    var timeString = timeArray[0];
    //判断是否重复
    if (judgeIsRepeat(timeString, allTimeAray) == 0){//不重复
      allTimeAray.push(timeString);
    }
  }
  //2、收集列表数据(根据时间戳)
  var listArray = [];
  //2.1、遍历时间数组
  for(let i = 0; i < allTimeAray.length; i ++){
    var timeString = allTimeAray[i];
    var tempArray = [];
    //遍历列表数组
    for (let j = 0; j < rows.length; j++) {
      var model = rows[j];
      var modify_time = model.modify_time;
      var timeArray = modify_time.split(" ");
      var tempTimeString = timeArray[0];
      //判断字符是否相等
      if(tempTimeString == timeString){//相等
         tempArray.push(model);
      }
    }
    listArray.push(tempArray);
  }
  //3、列表数据重组
  var resultArray = [];
  for (let i = 0; i < allTimeAray.length; i ++){
    var timeString = allTimeAray[i];
    var modelArray = listArray[i];
    //组成字典
    var tempDict = {
      time: timeString,
      childArray: modelArray
    }
    //添加到数组
    resultArray.push(tempDict);
  }
  return resultArray;
}

/**
 * 判断是否有重复
 */
function judgeIsRepeat(object,array){
  var isRepeat = 0;
  for(let i = 0; i < array.length; i ++){
      var tempString = array[i];
      if(object == tempString){//有重复
        isRepeat = 1;
        break;
      }
  }
  return isRepeat;
}

/**
 * 特殊处理图片
 */
function dealImageData(rows){
  for(let i = 0; i < rows.length; i ++){
    var model = rows[i];
    //1、处理图片
    if (model.image){//有图片
      var imageArr = model.image;
      model.image = imageArr[0].url + '&_password=' +
        app.globalData.password + '&_userid=' + app.globalData.userId;
    }else{//使用默认图片
      model.image = '/image/img_ypmr.png';
    }
    //2、处理规格spec
    if(!model.spec){
      model.spec = ' ';
    }
  }
}

/**
 * 处理审核参数
 */
function dealPostParam(listModel,dataSource){
  //1、主表参数
  var mainParam = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    id: listModel.batchId,
    in_date: listModel.in_date,
    vendor_id: listModel.vendor ? listModel.vendor.id : '',
    warehouse_id: listModel.warehouse ? listModel.warehouse.id : '',
    price: listModel.price,
    cost: listModel.cost,
    op: 'Modify',
    discount: 100,
    review_state: 3,
    _subtables:''//字表
  };
  //2、子表参数
  var subArray = [];
  for (let i = 0; i < dataSource.length; i++){
    //子表参数模型
    var subDict = {
      op: '',
      id: '',
      warehouse_id: '',
      vendor_id: '',
      drug_id: '',
      general_name: '',
      spec: '',
      unit: '',
      drug_forms: '',
      manufacturer: '',
      expire_date: '',
      count: '',
      price: '',
      discount: '',
      total_discount: '100',
      sure_price: '',//小计
      cost: '',
      image: '',
      batch_no: ''
    }
    //药品模型
    var model = dataSource[i];
    console.log('药品模型药品模型药品模型药品模型');
    console.log(model);

    //子表赋值
    subDict.op = 'Modify';
    subDict.id = model.id;
    subDict.warehouse_id = model.warehouse_id ? model.warehouse_id.id : ''
    subDict.vendor_id = model.vendor_id ? model.vendor_id.id : '';
    subDict.drug_id = model.drug_id ? model.drug_id.id : '';
    subDict.general_name = model.common_name;
    subDict.spec = model.spec;
    subDict.unit = model.unit ? model.unit.id : '';
    subDict.drug_forms = model.drug_forms ? model.drug_forms.id : '';
    subDict.manufacturer = model.manufacturer ? model.manufacturer.id : '';
    subDict.expire_date = model.expire_date;
    subDict.count = model.count;
    subDict.price = model.price;
    subDict.discount = model.discount;
    subDict.total_discount = '100';
    subDict.sure_price = model.price * model.count;//小计
    subDict.cost = model.cost;
    if (model.image) {//有图片
      if (model.image.length > 0) {
        var imageDict = model.image[0];
        subDict.image = imageDict.key_name;
      } else {
        subDict.image = '';
      }
    } else {
      subDict.image = '';
    }
    subDict.batch_no = model.batch_no;
    //装入数组
    subArray.push(subDict);
  };
  //3、子表参数转换(json字符串)
  var medicineDict = {
    pw_bill_detail: subArray,
  };
  var jsonString = JSON.stringify(medicineDict);
  //4、完善主表参数
  mainParam._subtables = jsonString;
  return mainParam;
}

/**
 * 对外接口
 */
module.exports = {
  downloadWarehouseRequest: downloadWarehouseRequest,
  downloadVendorRequest: downloadVendorRequest,
  downloadDrugListRequest: downloadDrugListRequest,
  loadDrugDataByCode: loadDrugDataByCode,
  getStoragedData: getStoragedData,
  getStoragingData: getStoragingData,
  dealStoragedData: dealStoragedData,
  getPwBillDetail: getPwBillDetail,
  postDrugData: postDrugData,
  submitDrug: submitDrug,
  checkIsInit: checkIsInit
}