//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

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

//请求供应商列表
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

//根据药品类型请求药品列表
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
    onSuccess(dealDrugsArrayData(drugsArr), totalCount);
  },
  function (fail) {
    onFail(fail);
  });
}

//查询药品是否存在基础库????
function judgeDrugWhetherInBasic(code, onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    uuid: code
  }
  netJs.getRequest('/cloud/prj/gmi/base/api/BaseApi?op=DrugFromBasic', params,
    function (success) {
      var stateCode = success.data.code;
      onSuccess(stateCode);
    },
    function (fail) {
      onFail(fail);
    });
}

//根据条形码请求药品信息??????
function loadDrugDataByCode(code, onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    uuid: code
  }
  netJs.getRequest('/app?op=Page&cloud=drug', params,
    function (success) {
      var stateCode = success.data.code;
      if (stateCode == 200) {
        
        var rows = success.data.rows;
        if (rows.length > 0) {
          var durgDict = rows[0];
          
          var drugModel = {
            drugId: durgDict.id,                  //药品id
            common_name: drugDict.common_name,    //通用名
            key_name: drugDict.key_name,          //商品名
            manufacturer: drugDict.manufacturer,  //厂家
            spec: durgDict.spec,                  //规格
            drug_forms: durgDict.drug_forms,      //剂型
            image: '',                            //图片
            count: 0,                             //数量
            price: drugDict.cost,                 //价格
            batch_no:'',                          //批号
            expire_date:'',                       //有效期至
            is_select: true,                      //是否选中
            deletestate: false,                   //是否处于删除状态
          }
          var imageArr = drugDict.image;
          drugModel.image = imageArr[0].url + '&_password=' +
            app.globalData.password + '&_userid=' + app.globalData.userId;
          onSuccess(drugModel);
        }
        else {
          onSuccess('');
        }
      }
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
        onFail();
      }
    },
    function (fail) {
      console.log('failfailfailfailfailfail');
      onFail(fail);
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
 * 审核通过
 */
function postDrugData(listModel, dataSource, onSuccess, onFail){
  //参数
  var mainParam = dealPostParam(listModel,dataSource);
  //网络请求
  netJs.getRequest('/app?op=Modify&cloud=pw_bill', mainParam,
    function (success) {
      var code = success.data.code;
      if(code == 200){//审核通过
        onSuccess();
      }else{//审核失败
        onFail();
      }
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 药品列表数据处理
 */
function dealDrugsArrayData(drugsArr) {
  //临时数组
  var tempArray = [];
  for (let i = 0; i < drugsArr.length; i++) {
    var drugModel = {
      drugId:'',        //药品id
      common_name:'',   //通用名
      key_name:'',      //商品名
      manufacturer:'',  //厂家
      spec:'',          //规格
      drug_forms:'',    //剂型
      image: '',        //图片
      unit:'',          //单位
      expire_date:'',   //有效期至
      cost:'',          //小计
      price:'',         //进货单价
      count:'',         //数量
      batch_no:'',      //批号
      is_select:false,  //是否选中
      deletestate:false //是否处于删除状态
    }

    var drugDict = drugsArr[i];
    drugModel.drugId = drugDict.id;
    drugModel.common_name = drugDict.common_name;
    drugModel.key_name = drugDict.key_name;
    drugModel.manufacturer = drugDict.manufacturer;
    drugModel.spec = drugDict.spec;
    drugModel.drug_forms = drugDict.drug_forms;
    //判断是否是中药
    if (drugDict.dug_type.id == 3){//中药
      drugModel.unit = drugDict.rx_unit;
    }else{//西药、中成药、医疗器械
      drugModel.unit = drugDict.min_unit;
    }
    drugModel.cost = drugDict.cost;
    //处理图片
    if (drugDict.image) {
      var imageArr = drugDict.image;
      drugModel.image = imageArr[0].url + '&_password=' +
        app.globalData.password + '&_userid=' + app.globalData.userId;
    }
    else {
      drugModel.image = '/image/img_ypmr.png';
    }
    //添加到数组
    tempArray.push(drugModel);
  }
  return tempArray;
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
      discount: '',
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
    subDict.general_name = model.general_name;
    subDict.dug_type = model.dug_type ? model.dug_type.id : '';
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
      var imageDict = model.image[0];
      subDict.image = imageDict.key_name;
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
      dug_type: '',
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
    //子表赋值
    subDict.op = 'Modify';
    subDict.id = model.id;
    subDict.warehouse_id = model.warehouse_id ? model.warehouse_id.id : ''
    subDict.vendor_id = model.vendor_id ? model.vendor_id.id : '';
    subDict.drug_id = model.drug_id ? model.drug_id.id : '';
    subDict.general_name = model.general_name;
    subDict.dug_type = model.dug_type ? model.dug_type.id : '';
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
    if(model.image){//有图片
      var imageDict = model.image[0];
      subDict.image = imageDict.key_name;
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
  judgeDrugWhetherInBasic: judgeDrugWhetherInBasic,
  loadDrugDataByCode: loadDrugDataByCode,
  getStoragedData: getStoragedData,
  getStoragingData: getStoragingData,
  dealStoragedData: dealStoragedData,
  getPwBillDetail: getPwBillDetail,
  postDrugData: postDrugData,
  submitDrug: submitDrug
}