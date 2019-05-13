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
      console.log('药品初始化列表---------');
      console.log(drugsArr);
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
      console.log('工厂------------');
      console.log(success);
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
      console.log('工厂------------');
      console.log(success);
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
 * 获取单位列表
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
 * 增加单位
 */
function addUnitToList(unit,onSuccess, onFail){
  var params = {
    key_name: unit,
    _userid: app.globalData.userId,
    _password: app.globalData.password,
  }
  netJs.getRequest('/app?op=Add&cloud=drug_unit', params,
    function (success) {
      console.log(success);
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

//查询药品是否存在基础库???????????
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

//根据条形码请求药品信息???????????
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
            expire_date: '',                      //有效期至
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
 * 药品列表数据处理
 */
function dealDrugsArrayData(drugsArr) {
  //临时数组
  var tempArray = [];
  for (let i = 0; i < drugsArr.length; i++) {
    //模型
    var drugModel = {
      drugId: '',           //药品id
      image: '',            //图片
      common_name: '',      //通用名
      manufacturer: '',     //厂家
      key_name: '',         //商品名
      min_unit:'',          //进货价和处方价单位
      realCount:'',         //经过转化的库存(有单位))
      spec: '',             //规格
      drug_forms: '',       //剂型
      local_count: '',      //库存数量
      uuid:'',              //条形码
      dug_type:'',          //药品类型
      drug_forms:'',        //剂型
      rx_unit:'',           //拆零单位
      change_count:'',      //包装单位与拆零单位换算
      single_unit:'',       //剂量单位
      taking_count:'',      //拆零单位与剂量单位换算
      cost: '',             //进货价
      min_price: '',        //处方价(包装单位)
      sale_price:'',        //处方价(拆零单位)
      retail_min_price:'',  //零售价(包装单位)
      retail_sale_price:'', //零售价(拆零单位)
      instruction_en_name:'',//用法

    }
    //处理模型
    var drugDict = drugsArr[i];
    //药品id
    drugModel.drugId = drugDict.id;
    //图片
    if (drugDict.image) {
      var imageArr = drugDict.image;
      drugModel.image = imageArr[0].url + '&_password=' +
        app.globalData.password + '&_userid=' + app.globalData.userId;
    } else {
      drugModel.image = '/image/img_ypmr.png';
    }
    //通用名
    drugModel.common_name = drugDict.common_name;
    //厂家
    drugModel.manufacturer = drugDict.manufacturer;
    //商品名
    drugModel.key_name = drugDict.key_name;
    //进货价和处方价单位
    drugModel.min_unit = drugDict.min_unit,
    //规格
    drugModel.spec = drugDict.spec;
    //处理库存展示形式
    var realCountString = dealRealCount(drugDict);
    drugModel.realCount = realCountString,//经过转化的库存
    //其余字断
    //剂型
    drugModel.drug_forms = drugDict.drug_forms,  
    //库存数量
    drugModel.local_count = drugDict.local_count;
    //条形码
    drugModel.uuid = drugDict.uuid;
    //药品类型
    drugModel.dug_type = drugDict.dug_type;
    //剂型
    drugModel.drug_forms = drugDict.drug_forms;
    //拆零单位
    drugModel.rx_unit = drugDict.rx_unit;
    //包装单位与拆零单位换算
    drugModel.change_count = drugDict.change_count; 
    //剂量单位
    drugModel.single_unit = drugDict.single_unit;
    //拆零单位与剂量单位换算
    drugModel.taking_count = drugDict.taking_count;
    //进货价
    drugModel.cost = drugDict.cost;
    //处方价(包装单位)
    drugModel.min_price = drugDict.min_price;
    //处方价(拆零单位)
    drugModel.sale_price = drugDict.sale_price;
    //零售价(包装单位)
    drugModel.retail_min_price = drugDict.retail_min_price;
    //零售价(拆零单位)
    drugModel.retail_sale_price = drugDict.retail_sale_price;
    //添加到数组
    tempArray.push(drugModel);
  }
  return tempArray;
}

/**
 * 处理库存展示
 */
function dealRealCount(drugDict){
  var realCountString = '';
  //1、包装单位数量
  var minCount = parseFloat(drugDict.local_count) / parseInt(drugDict.change_count);
  //拆零单位数量
  var rxCount = parseFloat(drugDict.local_count) - parseInt(minCount) * parseInt(drugDict.change_count);
  //2、包装单位
  var minUnit = (drugDict.min_unit) ? drugDict.min_unit.key_name : '';
  //拆零单位
  var rxUnit = (drugDict.rx_unit) ? drugDict.rx_unit.key_name : '';
  //3、判断
  if (minUnit == rxUnit) 
  {//两个单位相同、只显示拆零单位
    realCountString = drugDict.local_count + rxUnit;
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
  return realCountString;
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
  loadManufacturerWithKeyWord: loadManufacturerWithKeyWord
}