//获取应用实例
const app = getApp();
//网络请求
var netJs = require('../netUtil.js');

/**
 * 请求药品列表(西药:1、中成药:2、中药:3、医疗器械:4)
 */
function downloadDrugListRequest(drugtype, page, onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    page: page,
    rows: '15',
    dug_type: drugtype
  }
  netJs.getRequest('/app?op=Page&cloud=drug', params,
    function (success) {
      var drugsArr = success.data.rows;
      var totalCount = success.data.total;
      onSuccess(dealDrugsArrayData(drugsArr), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 获取生产厂家(Page)
 */
function loadManufacturerList(page, rows,onSuccess, onFail) {
  var params = {
    page: page,
    rows: rows,
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=Page&cloud=drug_manufacturer[clinic]', params,
    function (success) {
      var rows = success.data.rows;
      var totalCount = success.data.total;
      var modelArr = [];
      for (let i = 0; i < rows.length; i++) {
        var dict = rows[i];
        //模型
        var model = {
          id: dict.id,
          key_name: dict.key_name,
          is_select: false
        }
        modelArr.push(model);
      }
      onSuccess(modelArr, totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 获取生产厂家(List)
 */
function loadManufacturerWithKeyWord(page, rows, key_word,onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=List&cloud=drug_manufacturer[clinic]', params,
    function (success) {
      var rows = success.data.rows;
      var totalCount = success.data.total;
      var modelArr = [];
      for (let i = 0; i < rows.length; i++) {
        var dict = rows[i];
        //模型
        var model = {
          id: dict.id,
          key_name: dict.key_name,
          is_select: false
        }
        modelArr.push(model);
      }
      onSuccess(modelArr, totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 获取药品剂型
 */
function loadDrugFormsList(onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=List&cloud=drug_form_type[clinic]', params,
    function (success) {
      var rows = success.data.rows;
      var modelArr = [];
      for (let i = 0; i < rows.length; i++) {
        var drugformDict = rows[i];
        //重新生成模型
        var model = {
          drugformId: drugformDict.id,      //id
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
 * 获取单位列表(处方单位、拆零单位、服用单位)
 */
function loadDrugUnitList(onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=List&cloud=drug_unit', params,
    function (success) {
      var rows = success.data.rows;
      var modelArr = [];
      for (let i = 0; i < rows.length; i++) {
        var drugformDict = rows[i];
        //重新生成模型
        var model = {
          drugformId: drugformDict.id,      //id
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
 * 增加单位(处方单位、拆零单位、服用单位)
 */
function addUnitToList(unit,onSuccess, onFail){
  var params = {
    key_name: unit,
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=Add&cloud=drug_unit', params,
    function (success) {
      var result = success.data;
      if (result.code == 200){//添加成功
        var dataModel = result.data;
        onSuccess(dataModel);
      }else{//添加失败
        wx.showToast({
          title: result.remark ? result.remark : '网络加载失败',
        });
      }
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 增加供应商字段
 */
function addVendorToList(vendor, onSuccess, onFail){
  console.log('增加供应商字段');
  var params = {
    key_name: vendor,
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=Add&cloud=vendor', params,
    function (success) {
      var result = success.data;
      if (result.code == 200) {//添加成功
        var dataModel = result.data;
        onSuccess(dataModel);
      } else {//添加失败
        wx.showToast({
          title: result.remark ? result.remark : '网络加载失败',
        });
      }
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 获取用法列表
 */
function getUsageList(onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=List&cloud=drug_usage[enclinic]', params,
    function (success) {
      var result = success.data;
      if (result.code == 200) {//成功
        onSuccess(dealUsageAndFrequencyArray(result.rows));
      } else {//失败
        wx.showToast({
          title: result.remark ? result.remark : '网络加载失败',
        });
      }
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 获取频率列表
 */
function getFrequencyList(onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/sys?op=LoadDict&key_name=DayType', params,
    function (success) {
      var result = success.data;
      if (result.code == 200) {//添加成功
        onSuccess(dealUsageAndFrequencyArray(result.rows));
      } else {//添加失败
        wx.showToast({
          title: result.remark ? result.remark : '网络加载失败',
        });
      }
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 药品初始化修改或者增加接口
 */
function postAllData(drugModel, isEdit,onSuccess, onFail){
  //1、参数
  console.log('药品初始化修改或者增加接口');
  var params = makePostDataParam(drugModel, isEdit);
  //2、网络请求
  netJs.getRequest('/app?op=Modify&cloud=drug', params,
    function (success) {
      console.log('药品初始化修改或者增加接口-----success');
    },
    function (fail) {
      console.log('药品初始化修改或者增加接口-----fail');
      onFail(fail);
    });
}

/**
 * 查询药品是否已经开过处方
 */
function checkUse(drugId, onSuccess, onFail){
  var params = {
    drug_id: drugId,
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/gmi/drug?op=checkUse', params,
    function (success) {
      console.log('查询药品是否已经开过处方');
      console.log(success.data.code);
      onSuccess(success.data.code);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 中药用法/西药用法(drug_usage[en]、drug_usage[zh])
 */
function chineseAndWestUsage(cloudName, onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  var urlString = '/app?op=List&cloud=' + cloudName;
  netJs.getRequest(urlString, params,
    function (success) {
      console.log('中药用法/西药用法-------');
      console.log(success.data);
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
 * 构造模型
 */
function createListModel(){
  //模型
  var drugModel = {
    //1、
    drugId: '',       //药品id/basic_id
    warehouse_id: '',  //入库列表
    vendor_id: '',     //供应商列表
    is_basic: '',      //是否是基础库
    //2、
    image: '',         //图片
    //3、
    common_name: '',   //通用名
    key_name: '',      //商品名
    manufacturer: '',  //厂家
    uuid: '',          //条形码
    dug_type: '',      //药品类型
    drug_forms: '',    //剂型
    //4、
    min_unit: '',     //处方单位
    rx_unit: '',      //拆零单位
    change_count: '', //包装与拆零换算比例
    single_unit: '',  //服用单位
    taking_count: '', //服用单位
    spec: '',         //规格
    //5、
    cost: '',        //进货价
    min_price: '',   //处方价(大单位)
    sale_price: '',  //处方价(小单位)
    retail_min_price: '',//零售价(大单位)
    retail_sale_price: '',//零售价(小单位)
    //6、
    instruction_en: '',  //西药用法
    instruction_zh: '',  //中药用法
    common_frequency: '',//西药频率
    common_count: '',    //单次用量(中药叫单剂量)
    common_days: '',     //用药天数
    warning_time: '',    //有效期预警
    range_low: '',       //库存下限
    range_up: '',        //库存上限
    //7、
    begin_json: '',    //有效期批次
    begin_count: '',   //有效期数量
    //8、
    local_count: '',//库存
    //9、
    manufacturer_name: '',//生产厂家
    drug_forms_name: '',//剂型
    min_name: '',//包装单位
    rx_name: '',//拆零单位
    single_name: '',//服用单位
    instruction_en_name: '',//西药用法
    instruction_zh_name: '',//中药用法
    realCount: '',//经过转化的库存(有单位)
    usage: '',//用法用量(主要是西药和中成药用)
  }
  return drugModel;
}

/**
 * 构造网络请求参数
 */
function makePostDataParam(drugModel,isEdit){
  var paramDict = {};
  //1、
  //药品id
  paramDict.id = drugModel.drugId ? drugModel.drugId : 0;
  //入库列表
  paramDict.warehouse_id = drugModel.warehouse_id ? drugModel.warehouse_id.id : 0;
  //供应商列表
  paramDict.vendor_id = drugModel.vendor_id ? drugModel.vendor_id.id : 0;
  //是否是基础库
  paramDict.is_basic = drugModel.is_basic ? drugModel.is_basic.id : 0;

  //2、
  //通用名
  paramDict.common_name = drugModel.common_name ? drugModel.common_name : '';
  //商品名
  paramDict.key_name = drugModel.key_name ? drugModel.key_name : drugModel.common_name;
  //生产厂家
  paramDict.manufacturer_name = drugModel.manufacturer_name ? drugModel.manufacturer_name : '';
  //条形码
  paramDict.uuid = drugModel.uuid ? drugModel.uuid : '';
  //药品类型
  paramDict.dug_type = drugModel.dug_type ? drugModel.dug_type.id : 0;
  //剂型
  paramDict.drug_forms_name = drugModel.drug_forms_name ? drugModel.drug_forms_name : '';

  //3、(这里分中西药)
  //处方单位
  paramDict.min_name = drugModel.min_name ? drugModel.min_name : '';
  //拆零单位
  paramDict.rx_name = drugModel.rx_name ? drugModel.rx_name : '';
  //包装与拆零单位换算
  paramDict.change_count = drugModel.change_count ? drugModel.change_count : 1;
  //剂量单位
  paramDict.single_name = drugModel.single_name ? drugModel.single_name : '';
  //拆零与剂量单位换算
  paramDict.taking_count = drugModel.taking_count ? drugModel.taking_count : 1;
  //规格
  paramDict.spec = drugModel.spec ? drugModel.spec : '';

  //4、
  //进货价
  paramDict.cost = drugModel.cost ? drugModel.cost : 0;
  //处方价(大单位)
  paramDict.min_price = drugModel.min_price ? drugModel.min_price : 0;
  //处方价(小单位)
  paramDict.sale_price = drugModel.sale_price ? drugModel.sale_price : 0;
  //零售价(大单位)
  paramDict.retail_min_price = drugModel.retail_min_price ? drugModel.retail_min_price : 0;
  //零售价(小单位)
  paramDict.retail_sale_price = drugModel.retail_sale_price ? drugModel.retail_sale_price : 0;

  //5、
  //西药用法
  paramDict.instruction_en_name = drugModel.instruction_en_name ? drugModel.instruction_en_name : '';
  //中药用法
  paramDict.instruction_zh_name = drugModel.instruction_zh_name ? drugModel.instruction_zh_name : '';
  //频率
  paramDict.common_frequency = drugModel.common_frequency ? drugModel.common_frequency.id : 0;
  //单次用量(中药的单剂量)
  paramDict.common_count = drugModel.common_count ? drugModel.common_count : 0;
  //用药天数
  paramDict.common_days = drugModel.common_days ? drugModel.common_days : 0;

  //6、有效期预警
  paramDict.warning_time = drugModel.warning_time ? drugModel.warning_time.id : 2;

  //7、库存安全范围
  paramDict.range_low = drugModel.range_low ? drugModel.range_low : 0;
  paramDict.range_up = drugModel.range_up ? drugModel.range_up : 0;

  //8、库存批次
  paramDict.begin_count = drugModel.begin_count ? drugModel.begin_count : 0;
  paramDict.begin_json = drugModel.begin_json ? drugModel.begin_json : '';

  //9、用户名和密码
  paramDict._userid = app.globalData.userId;
  paramDict._password = app.globalData.password;

  return paramDict;
}

/**
 * 药品初始化扫码网络请求
 * 根据条形码请求药品信息(202:药品已经初始化过、200:代表尚未初始化过 )
 */
function loadDrugInfoFirstByCode(code, onSuccess, onFail) {
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    uuid: code
  }
  netJs.getRequest('/cloud/prj/gmi/base/api/BaseApi?op=DrugFromBasic', params,
    function (success) {
      console.log('查询是否初始化过');
      console.log(success.data.code);
      onSuccess(success.data.code);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 1.1、根据条形码获取药品信息(202:药品已经初始化过)
 */
function getDrugWithKeyWord(code, onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    key_word: code,
    page:1,
    rows:10
  }
  netJs.getRequest('/app?op=Page&cloud=drug', params,
    function (success) {
      console.log('202状态下获取药品信息');
      //取数组的第一个
      //review_state判断是否已经禁用、走失败，给出提示
      console.log(success);
      //成功后、弹出提示框
      //该药品已初始化，是否修改？
      //点击否，继续扫描
      //点击是，进入编辑界面，isEdit=YES，把请求到的模型弄进去
    },
    function (fail) {
      onFail(fail);
    });
} 

/**
 * 2.1、查询药品是否存在基础库(200:药品没有初始化过)
 */
function checkDrugisFromBasicStorage(code, onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    page: 1,
    rows:50,
    key_word:code
  }
  netJs.getRequest('/app?op=Page&cloud=drug_basis', params,
    function (success) {
      console.log('checkDrugisFromBasicStorage');
      console.log(success.data.rows);
      //判断rows数组数量是否大于0，否则按照失败处理
      //如果成功的话、对数组进行处理
      //id
      //begin_json
      //image

      //如果查询到的数组为空、证明基础库不存在、继续用code进行第三方查询
      //不过这个时候走的自定义添加的路线，只不过是，刚开始有数据罢了
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 2.2、根据条形码查询第三方药品信息
 */
function loadDrugInformationFromNetAPI(code, onSuccess, onFail){
  netJs.loadDrugInfoWithCode(code,
    function (success) {
      console.log('根据条形码查询第三方药品信息');
      console.log(success);



      //判断rows数组数量是否大于0，否则按照失败处理
      //如果成功的话、对数组进行处理
      //id
      //begin_json
      //image

      //如果查询到的数组为空、证明基础库不存在、继续用code进行第三方查询
      //不过这个时候走的自定义添加的路线，只不过是，刚开始有数据罢了
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 在基础库中搜索添加药品
 */
function searchDrugFromBasis(key_word, dug_type, page, rows, onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    page: page,
    rows: rows,
    dug_type: 1,
    key_word: key_word
  }
  netJs.getRequest('/app?op=Page&cloud=drug_basis', params,
    function (success) {
      console.log('在基础库中搜索添加药品------------');
      var drugsArr = success.data.rows;
      var totalCount = success.data.total;
      onSuccess(dealDrugsArrayData(drugsArr), totalCount);
    },
    function (fail) {
      onFail(fail);
    });
}

/**
 * 查询进出库药品是否已经初始化(某个药品)
 */
function loadDrugInfoFirstByNameAndCompany(common_name, manufacturerId, onSuccess, onFail){
  var params = {
    _userid: app.globalData.userId,
    _password: app.globalData.password,
    common_name: common_name,
    manufacturer: manufacturerId
  }
  netJs.getRequest('/cloud/prj/gmi/base/api/BaseApi?op=DrugFromBasic', params,
    function (success) {
      console.log('查询是否初始化过');
      console.log(success.data.code);
      onSuccess(success.data.code);
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
    //模型
    var drugModel = {
      //1、
      drugId: '',       //药品id/basic_id
      warehouse_id: '',  //入库列表
      vendor_id: '',     //供应商列表
      is_basic: '',      //是否是基础库
      //2、
      image: '',         //图片
      //3、
      common_name: '',   //通用名
      key_name: '',      //商品名
      manufacturer: '',  //厂家
      uuid: '',          //条形码
      dug_type: '',      //药品类型
      drug_forms: '',    //剂型
      //4、
      min_unit: '',     //处方单位
      rx_unit: '',      //拆零单位
      change_count: '', //包装与拆零换算比例
      single_unit: '',  //服用单位
      taking_count: '', //服用单位
      spec: '',         //规格
      //5、
      cost: '',        //进货价
      min_price: '',   //处方价(大单位)
      sale_price: '',  //处方价(小单位)
      retail_min_price: '',//零售价(大单位)
      retail_sale_price: '',//零售价(小单位)
      //6、
      instruction_en: '',  //西药用法
      instruction_zh: '',  //中药用法
      common_frequency: '',//西药频率
      common_count: '',    //单次用量(中药叫单剂量)
      common_days: '',     //用药天数
      warning_time: '',    //有效期预警
      range_low: '',       //库存下限
      range_up: '',        //库存上限
      //7、
      begin_json: '',    //有效期批次
      begin_count: '',   //有效期数量
      //8、
      local_count: '',//库存
      //9、
      manufacturer_name: '',//生产厂家
      drug_forms_name: '',//剂型
      min_name: '',//包装单位
      rx_name: '',//拆零单位
      single_name: '',//服用单位
      instruction_en_name: '',//西药用法
      instruction_zh_name: '',//中药用法
      realCount:'',//经过转化的库存(有单位)
      usage:'',//用法用量(主要是西药和中成药用)
    }
    //处理模型
    var drugDict = drugsArr[i];
    //1、
    drugModel.drugId = drugDict.id;//药品id/basic_id
    drugModel.warehouse_id = drugDict.warehouse_id;//入库列表(dict)
    drugModel.vendor_id = drugDict.vendor_id;//供应商列表(dict)
    drugModel.is_basic = drugDict.is_basic;//是否是基础库(dict)
    //2、处理图片
    if (drugDict.image) {
      var imageArr = drugDict.image;
      drugModel.image = imageArr[0].url + '&_password=' +
        app.globalData.password + '&_userid=' + app.globalData.userId;
    }
    else {
      drugModel.image = '/image/img_ypmr.png';
    }
    //3、
    drugModel.common_name = drugDict.common_name;//通用名
    drugModel.key_name = drugDict.key_name;//商品名
    drugModel.manufacturer = drugDict.manufacturer;//厂家(dict)
    drugModel.uuid = drugDict.uuid;//条形码
    drugModel.dug_type = drugDict.dug_type;//药品类型(dict)
    drugModel.drug_forms = drugDict.drug_forms;//剂型(dict)
    //4、
    drugModel.min_unit = drugDict.min_unit;//处方单位(dict)
    drugModel.rx_unit = drugDict.rx_unit;//拆零单位(dict)
    drugModel.change_count = drugDict.change_count;//包装与拆零换算比例
    drugModel.single_unit = drugDict.single_unit;//服用单位(dict)
    drugModel.taking_count = drugDict.taking_count;//服用单位
    drugModel.spec = drugDict.spec;//规格
    //5、
    drugModel.cost = drugDict.cost;//进货价
    drugModel.min_price = drugDict.min_price;//处方价(大单位)
    drugModel.sale_price = drugDict.sale_price;//处方价(小单位)
    drugModel.retail_min_price = drugDict.retail_min_price;//零售价(大单位)
    drugModel.retail_sale_price = drugDict.retail_sale_price;//零售价(小单位)
    //6、
    drugModel.instruction_en = drugDict.instruction_en;//西药用法(dict)
    drugModel.instruction_zh = drugDict.instruction_zh;//中药用法(dict)
    drugModel.common_frequency = drugDict.common_frequency;//西药频率(dict)
    drugModel.common_count = drugDict.common_count;//单次用量(中药叫单剂量)
    drugModel.common_days = drugDict.common_days;//用药天数
    drugModel.warning_time = drugDict.warning_time;//有效期预警(dict)
    drugModel.range_low = drugDict.range_low;//库存下限
    drugModel.range_up = drugDict.range_up;//库存上限
    //7、
    drugModel.begin_json = drugDict.begin_json;//有效期批次
    drugModel.begin_count = drugDict.begin_count;//有效期数量
    //8、
    drugModel.local_count = drugDict.local_count;
    //9、其它处理
    //自定义字段赋值
    dealCustomize(drugModel);
    //处理空值
    dealEmptyValue(drugModel);
    //处理单位(处方单位、拆零单位、服用单位)
    dealAllUnit(drugModel);
    //处理规格
    dealSpec(drugModel);
    //处理库存展示形式
    dealRealCount(drugModel);
    //处理用法用量
    dealUsage(drugModel);
    //添加到数组
    tempArray.push(drugModel);
  }
  return tempArray;
}

/**
 * 处理自定义字段
 */
function dealCustomize(drugModel){
  //生产厂家
  drugModel.manufacturer_name = drugModel.manufacturer ? drugModel.manufacturer.key_name : '';
  //剂型
  drugModel.drug_forms_name = drugModel.drug_forms ? drugModel.drug_forms.key_name : '';
  //包装单位
  drugModel.min_name = drugModel.min_unit ? drugModel.min_unit.key_name : '';
  //拆零单位
  drugModel.rx_name = drugModel.rx_unit ? drugModel.rx_unit.key_name : '';
  //服用单位
  drugModel.single_name = drugModel.single_unit ? drugModel.single_unit.key_name : '';
  //西药用法
  drugModel.instruction_en_name = drugModel.instruction_en ? drugModel.instruction_en.key_name : '';
  //中药用法
  drugModel.instruction_zh_name = drugModel.instruction_zh ? drugModel.instruction_zh.key_name : '';
}

/**
 * 处理空值
 */
function dealEmptyValue(drugModel){
  //有效期预警
  drugModel.warning_time = drugModel.warning_time ? drugModel.warning_time : { "id": "2", "key_name": "2个月" };
  //库存安全范围
  drugModel.range_up = drugModel.range_up ? drugModel.range_up : '200';
  drugModel.range_low = drugModel.range_low ? drugModel.range_low : '20';
  //批次
  // drugModel.begin_json = drugModel.begin_json ? drugModel.begin_json : [{ "expire_date": "", "count": "" }];
  drugModel.begin_json = drugModel.begin_json ? drugModel.begin_json : [];
  //对中药drug_forms特殊处理(判断是不是中药)
  var drugType = drugModel.dug_type ? drugModel.dug_type.id : 1;
  if (drugType == 3){//是中药
    drugModel.drug_forms_name = drugModel.drug_forms_name ? drugModel.drug_forms_name : '中药饮片';
  }
}

/**
 * 处理所有单位
 */
function dealAllUnit(drugModel){
  //判断当前是中药还是西药
  var dugTypId = drugModel.dug_type ? drugModel.dug_type.id : '1';
  if (dugTypId != 3){//不是中药
    //处方单位
    if (!drugModel.min_unit) {
      drugModel.min_name = '盒';
    }
    //拆零单位
    if (!drugModel.rx_unit) {
      drugModel.rx_name = '盒';
      drugModel.change_count = 1;
    }
    //服用单位
    if (!drugModel.single_unit) {
      drugModel.single_name = '盒';
      drugModel.taking_count = 1;
    }
  }else{//是中药
    //处方单位
    if (!drugModel.min_unit) {
      drugModel.min_name = 'g';
    }
    //拆零单位
    if (!drugModel.rx_unit) {
      drugModel.rx_name = 'g';
      drugModel.change_count = 1;
    }
    //服用单位
    if (!drugModel.single_unit) {
      drugModel.single_name = 'g';
      drugModel.taking_count = 1;
    }
  }
}

/**
 * 处理规格
 */
function dealSpec(drugModel){
  var singleUnit = drugModel.single_name ? drugModel.single_name : '';
  var rxUnit = drugModel.rx_name ? drugModel.rx_name : '';
  var minUnit = drugModel.min_name ? drugModel.min_name : '';
  var changeCount = drugModel.change_count ? drugModel.change_count : '';
  var takingCount = drugModel.taking_count ? drugModel.taking_count : '';
  var dugTypId = drugModel.dug_type ? drugModel.dug_type.id : '1';
  if (minUnit == rxUnit){ //包装单位与拆零单位相同
    if (dugTypId == 4){//医疗器械
        drugModel.spec = '1' + rxUnit;
    }else{//非医疗器械
      if (rxUnit == singleUnit) {//拆零单位与剂量单位相同
        drugModel.spec = '1' + rxUnit;
      }else {//不相同
        drugModel.spec = takingCount + singleUnit + '/' + rxUnit;
      }
    }
  }
  else{//不相同
    if (rxUnit == singleUnit){//拆零和剂量单位相同
      drugModel.spec = changeCount + rxUnit + '/' + minUnit;
    }else{//不相同
      if (dugTypId == 4){//医疗器械
        drugModel.spec = changeCount + rxUnit + '/' + minUnit;
      }else{
        drugModel.spec = takingCount + singleUnit + '/' + rxUnit + ';' + changeCount + rxUnit + '/' + minUnit;
      }
    }
  }
}

/**
 * 处理库存展示
 */
function dealRealCount(drugModel){
  var realCountString = '';
  //1、包装单位数量
  var minCount = parseFloat(drugModel.local_count) / parseInt(drugModel.change_count);
  //拆零单位数量
  var rxCount = parseFloat(drugModel.local_count) - parseInt(minCount) * parseInt(drugModel.change_count);
  //2、包装单位
  var minUnit = (drugModel.min_unit) ? drugModel.min_unit.key_name : '';
  //拆零单位
  var rxUnit = (drugModel.rx_unit) ? drugModel.rx_unit.key_name : '';
  //3、判断
  if (minUnit == rxUnit) 
  {//两个单位相同、只显示拆零单位
    realCountString = drugModel.local_count + rxUnit;
  }
  else 
  {//两个单位不相同、判断包装单位是否为0
    if (minCount == 0) 
    {//包装单位数量为0、只显示拆零单位
      realCountString = rxCount + rxUnit;
    } 
    else 
    {//包装单位不为0、判断拆零单位是否为0
      if (rxCount == 0) 
      {//拆零单位为0、只显示包装
        realCountString = minCount + minUnit;
      } 
      else 
      {//拆零单位不为0，显示包装 + 拆零
        realCountString = minCount + minUnit + rxCount + rxUnit;
      }
    }
  }
  //模型赋值
  drugModel.realCount = realCountString;
}

/**
 * 处理用法用量(主要用于西药)
 */
function dealUsage(drugModel){
  var tempArray = [];
  //用法
  tempArray.push(drugModel.instruction_en_name);
  //频率
  var frequencyName = drugModel.common_frequency ? drugModel.common_frequency.key_name : '';
  tempArray.push(frequencyName);
  //单次用量
  var singleUse = '';
  if (drugModel.common_count == -1){
    singleUse = '每次适量';
  }else{
    singleUse = '每次' + drugModel.common_count + drugModel.single_name;
  }
  tempArray.push(singleUse);
  //用药天数
  var dayString = '用药' + parseInt(drugModel.common_days) + '天';
  tempArray.push(dayString);
  //总结
  drugModel.usage = tempArray.join(';');
}

/**
 * 处理用法和频率
 */
function dealUsageAndFrequencyArray(rows){
  var resultArray = [];
  for(let i = 0; i < rows.length; i ++){
    //模型
    var model = {
      id: '',
      key_name: '',
      is_select:false
    };
    var tempModel = rows[i];
    model.id = tempModel.id;
    model.key_name = tempModel.key_name;
    resultArray.push(model);
  }
  return resultArray;
}


/**
 * 对外接口
 */
module.exports = {
  downloadDrugListRequest: downloadDrugListRequest,
  loadDrugUnitList: loadDrugUnitList,
  loadDrugFormsList: loadDrugFormsList,
  loadManufacturerList: loadManufacturerList,
  addUnitToList: addUnitToList,
  getUsageList: getUsageList,
  getFrequencyList: getFrequencyList,
  loadManufacturerWithKeyWord: loadManufacturerWithKeyWord,
  dealCustomize: dealCustomize,
  dealEmptyValue: dealEmptyValue,
  dealAllUnit: dealAllUnit,
  dealSpec: dealSpec,
  dealRealCount: dealRealCount,
  postAllData: postAllData,
  checkUse: checkUse,
  chineseAndWestUsage: chineseAndWestUsage,
  createListModel: createListModel,
  addVendorToList: addVendorToList,
  loadDrugInfoFirstByCode: loadDrugInfoFirstByCode,
  getDrugWithKeyWord: getDrugWithKeyWord,
  checkDrugisFromBasicStorage: checkDrugisFromBasicStorage,
  loadDrugInformationFromNetAPI: loadDrugInformationFromNetAPI,
  searchDrugFromBasis: searchDrugFromBasis,
  loadDrugInfoFirstByNameAndCompany: loadDrugInfoFirstByNameAndCompany
}