//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');
var drugJs = require('../../../../api/drugRequest/drugRequest.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listModel:'',//药品模型
    selectImage:'/image/drughome/wj_initdrug_normal.png',//图片数组
    imageTipTitle:'上传药品图片',
    hasMask:false,//是否有蒙层
    drugTypeArray:['西药','中成药'],//药品类型
    disabledDrugType:false,//是否禁止药品类型
    screenWidth:0,//屏幕宽度
    screenHeight:0,//屏幕高度
    validityArray:[
      "1个月",
      "2个月",
      "3个月",
      "4个月",
      "5个月",
      "6个月",
    ],
    isPrescriptionDrug:false,//是否在处方中开过药
    isHidePopManufacturer:true,//是否隐藏联想列表
    isEdit:true,//当前是否是编辑界面
    vendorArray:[],//供应商数组
    warehouseArray:[],//仓库数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function  (options) {
    console.log('options----药品初始化详情');
    console.log(options);
    //1、初始化界面数据
    this.initData(options);
    //2、初始化模型数据
    var listModel = JSON.parse(options.listModel);  
    this.initModelData(listModel);
    //3、设置其它模型初始化数据
    this.setOtherModelPrivateData();
    //4、查询是否已经在处方开过药(决定能否更改药品类型)
    if(this.data.isEdit){//可编辑
      this.checkisPrescriptionDrug();
    }else{//不可编辑
      this.data.drugTypeArray = ['西药', '中成药','中药','医疗器械'];
      this.setData({
        drugTypeArray: this.data.drugTypeArray
      });
    }
    //5、获取仓库和供应商列表
    this.getVendorAndWarehouseList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 初始化界面数据
   */
  initData: function (options){
    //1、隐藏厂商联想列表
    this.setData({
      isHidePopManufacturer: this.data.isHidePopManufacturer
    });
    //2、屏幕尺寸设置
    this.data.screenWidth = wx.getSystemInfoSync().windowWidth;
    this.data.screenHeight = wx.getSystemInfoSync().windowHeight;
    console.log(this.data.screenWidth);
    console.log(this.data.screenHeight);
    this.setData({
      screenWidth: this.data.screenWidth,
      screenHeight: this.data.screenHeight
    });
    //3、判断是否是编辑
    (options.isEdit == 0) ? (this.data.isEdit = false) : (this.data.isEdit = true);
    this.setData({
      isEdit: this.data.isEdit
    });
  },

  /**
   * 数据初始化
   */
  initModelData:function(listModel){
    //1、对图片进行特殊处理
    if ((listModel.image != '/image/img_ypmr.png') && 
      (listModel.image != ''))  {
      listModel.image = decodeURIComponent(listModel.image);
      this.data.selectImage = listModel.image;
      this.data.imageTipTitle = "点击查看大图";
      this.setData({
        selectImage: this.data.selectImage,
        imageTipTitle: this.data.imageTipTitle
      });
    }
    //2、是否禁止药品类型选择
    if(this.data.isEdit){//可编辑状态才可以
      var dugType = listModel.dug_type ? listModel.dug_type.id : 1;
      if ((dugType == 3) || (dugType == 4)) {
        this.data.disabledDrugType = true;
      } else {
        this.data.disabledDrugType = false;
      }
    }
    //3、模型赋值
    this.data.listModel = listModel;
    this.setData({
      listModel: this.data.listModel,
      disabledDrugType:this.data.disabledDrugType
    });
  },

  /**
   * 设置模型其它初始化数据
   */
  setOtherModelPrivateData:function(){
    console.log('设置模型其它初始化数据');
    //1、处理空值
    initDrugJs.dealEmptyValue(this.data.listModel);
    //2、处理所有单位
    initDrugJs.dealAllUnit(this.data.listModel);
    //3、处理规格
    initDrugJs.dealSpec(this.data.listModel);   
    //4、刷新界面
    this.setData({
      listModel: this.data.listModel
    });
    console.log(this.data.listModel);
  },

  /**
   * 检查是否已经开过药品
   */
  checkisPrescriptionDrug:function(){
    console.log('检查是否已经开过药品======');
    var that = this;
    initDrugJs.checkUse(this.data.listModel.drugId, function (success) {
      if (success == 311) {//开过药品
        that.data.isPrescriptionDrug = true;
      } else {
        that.data.isPrescriptionDrug = false;
      }
    }, function (fail) {
      that.data.isPrescriptionDrug = false;
    });
  },

  /**
   * 获取仓库和供应商列表
   */
  getVendorAndWarehouseList:function(){
    var that = this;
    //1、判断模型的仓库是否为空
    if (!this.data.listModel.warehouse_id){//为空
      drugJs.downloadWarehouseRequest(function (success) {
        //1、仓库数组赋值
        that.data.warehouseArray = [];
        that.data.warehouseArray = that.data.warehouseArray.concat(success);
        //2、模型赋值
        var firstModel = that.data.warehouseArray[0];
        var dict = {
          id: firstModel.id,
          key_name: firstModel.key_name
        }
        that.data.listModel.warehouse_id = dict;
        //3、刷新界面
        that.setData({
          listModel: that.data.listModel,
          warehouseArray: that.data.warehouseArray,
        });
      }, function (fail) {
         wx.showToast({
           title: '网络加载失败',
         });
      });
    }  
    //2、判断模型的供应商是否为空
    if (!this.data.listModel.vendor_id){//为空
      drugJs.downloadVendorRequest(function (success) {
        //1、供应商数组赋值
        that.data.vendorArray = [];
        that.data.vendorArray = that.data.vendorArray.concat(success);
        //2、模型赋值
        var firstModel = that.data.vendorArray[0];
        var dict = {
          id: firstModel.id,
          key_name: firstModel.key_name
        }
        that.data.listModel.vendor_id = dict;
        //3、刷新界面
        that.setData({
          vendorArray: that.data.vendorArray,
          listModel: that.data.listModel
        });
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        })
      });
    }
  },

  /**
   * 选择照片
   */
  clickChooseImageButton:function(e){
    var that = this;
    wx.chooseImage({
      count: 1,//照片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var imageArray = res.tempFilePaths;
        if(imageArray.length > 0){//取出第一个
          that.data.selectImage = imageArray[0];
          that.setData({
            selectImage: that.data.selectImage
          });
        }
      }
    })
  },

  /**
   * 预览照片
   */
  previewImage(e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current,
      urls: [this.data.selectImage]
    })
  },

  /**
   * 通用名输入
   */
  commonNameInput:function(e){
    console.log('通用名输入');
    console.log(e);
    var value = e.detail.value;
    this.data.listModel.common_name = value;
  },

  /**
   * 商品名输入
   */
  keyNameInput:function(e){
    console.log('商品名输入');
    var value = e.detail.value;
    this.data.listModel.key_name = value;
  },

  /**
   * 生产厂家输入
   */
  manufacturerInput:function(e){
    console.log('生产厂家输入----');
    console.log(e);
    var value = e.detail.value;
    this.data.listModel.manufacturer_name = value;
  },

  /**
   * 点击生产厂家联想列表(暂时不做)
   */
  clickManufacturerItem:function(e){
    console.log('点击生产厂家联想列表');
  },

  /**
   * 选择生产厂家
   */
  chooseManufacturer:function(e){
    console.log('选择生产厂家');
    wx.navigateTo({
      url: '/pages/drugStore/InitDrug/initDrugSelectManufacturer/initDrugSelectManufacturer',
    })    
  },

  /**
   * 生产厂家反向传值
   */
  manufacturerManageBackData:function(data,target){
    console.log('生产厂家反向传值');
    this.data.listModel.manufacturer_name = data;
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 条形码输入
   */
  uuidInput:function(e){
    console.log('条形码输入');
    var value = e.detail.value;
    this.data.listModel.uuid = value;
  },

  /**
   * 条形码扫描
   */
  scanCode:function(e){
    console.log('扫描条形码');
    var that = this
    wx.scanCode({
      success(res) {
        that.data.listModel.uuid = res.result;
        that.setData({
          listModel: that.data.listModel
        });
      },fail() {
        wx.showToast({
          title: '扫码失败',
        });
      }
    });
  },

  /**
   * 药品类型
   */
  bindDrugTypeChange:function(e){
    console.log('药品类型---------');
    console.log(e);
    //判断是否可以修改药品类型
    if(this.data.isPrescriptionDrug){//不可以修改类型
      wx.showToast({
        title: '已开过药品,不能修改类型',
      });
      return;
    }
    //1、模型
    var tempDict = {
      id:1,
      key_name:'西药'
    };
    //2、赋值
    var val = e.detail.value;
    if (val == 0){//西药
      this.data.listModel.dug_type = tempDict;
    }else{//中成药
      tempDict.id = 1;
      tempDict.key_name = '中成药';
      this.data.listModel.dug_type = tempDict;
    }
    //3、刷新界面
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 选择剂型
   */
  chooseDrugForm:function(e){
    console.log('选择药品剂型=========');
    this.data.hasMask = true;
    this.setData({
      hasMask: this.data.hasMask
    });
    var modelView = this.selectComponent("#initDrugPopView");
    //展示模版(1:代表是剂量列表)
    modelView.showModal(1);
  },

  /**
   * 选择包装单位(非中药)
   */
  chooseMinUnit: function(e){
    console.log('选择包装单位-----');
    this.data.hasMask = true;
    this.setData({
      hasMask: this.data.hasMask
    });
    var modelView = this.selectComponent("#initDrugPopView");
    //展示模版(2:代表处方单位)
    modelView.showModal(2);
  },

  /**
   * 选择药品单位(中药)
   */
  chooseChineseMinUnit:function(e){
    console.log('选择药品单位(中药)');
    this.data.hasMask = true;
    this.setData({
      hasMask: this.data.hasMask
    });
    var modelView = this.selectComponent("#initDrugPopView");
    //展示模版(2:代表处方单位)
    modelView.showModal(2);
  },

  /**
   * 选择拆零单位
   */
  chooseRxUnit:function(e){
    console.log('选择拆零单位-----');
    this.data.hasMask = true;
    this.setData({
      hasMask: this.data.hasMask
    });
    var modelView = this.selectComponent("#initDrugPopView");
    //展示模版(3:代表拆零单位)
    modelView.showModal(3);
  },

  /**
   * 包装单位与拆零单位换算输入
   */
  changeCountInput: function (e) {
    console.log('包装单位与拆零单位换算输入');
    console.log(e.detail.value);
    this.data.listModel.change_count = e.detail.value;
  },

  /**
   * 选择剂量单位
   */
  chooseSingleUnit:function(e){
    console.log('选择剂量单位');
    this.data.hasMask = true;
    this.setData({
      hasMask: this.data.hasMask
    });
    var modelView = this.selectComponent("#initDrugPopView");
    //展示模版(1:代表剂量单位)
    modelView.showModal(4);
  },

  /**
   * 拆零与剂量单位换算
   */
  takingCountInput: function (e) {
    console.log('拆零与剂量单位换算');
    console.log(e.detail.value);
    this.data.listModel.taking_count = e.detail.value;
  },

  /**
   * 规格输入
   */
  specInput:function(e){
    console.log('规格输入');
    console.log(e);
    this.data.listModel.spec = e.detail.value;
  },

  /**
   * 价格管理
   */
  choosePrice: function (e) {
    console.log('价格管理=======');
    //1、处理模型参数
    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = this.data.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    //2、传递模型(转换json字符串)
    var listModelString = JSON.stringify(listModel);
    wx.navigateTo({
      url: '/pages/drugStore/InitDrug/initDrugPriceManager/initDrugPriceManager?listModel=' + listModelString,
    });
  },

  /**
   * 用法用量 
   */
  chooseUsage: function (e) {
    //1、处理模型参数
    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = this.data.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    //2、传递模型(转换json字符串)
    var listModelString = JSON.stringify(listModel);
    wx.navigateTo({
      url: '/pages/drugStore/InitDrug/initDrugUsage/initDrugUsage?listModel=' + listModelString,
    })
  },

  /**
   * 有效期预警
   */
  bindValidityChange: function (e) {
    //1、建立模型
    var warning_time = {
      id:2,
      key_name:'两个月',
    }
    //2、赋值
    const val = e.detail.value;
    warning_time.id = val + 1;//id
    warning_time.key_name = this.data.validityArray[val];
    //3、刷新界面
    this.data.listModel.warning_time = warning_time;
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 库存安全范围--下限
   */
  lowCountInput:function(e){
    console.log('库存安全范围--下限');
    console.log(e.detail.value);
    this.data.listModel.range_low = e.detail.value;
  },

  /**
   * 库存安全范围--上限
   */
  upCountInput:function(e){
    console.log('库存安全范围--上限');
    console.log(e);
    this.data.listModel.range_up = e.detail.value;
  },

  /**
   * 选择仓库
   */
  bindWarehouseChange:function(e){
    console.log('选择仓库-------');
    console.log(e);
    //取值
    var value = e.detail.value;
    var model = this.data.warehouseArray[value];
    //赋值
    var dict = {
      id: model.id,
      key_name: model.key_name
    };
    this.data.listModel.warehouse_id = dict;
    //刷新
    this.setData({
      listModel:this.data.listModel
    });
  },

  /**
   * 选择供应商
   */
  chooseVendor:function(){
    console.log('选择包装单位-----');
    this.data.hasMask = true;
    this.setData({
      hasMask: this.data.hasMask
    });
    var modelView = this.selectComponent("#initDrugPopView");
    //展示模版(5:代表供应商)
    modelView.showModal(5);
  },

  /**
   * 点击多个生产日期
   */
  clickManyDate:function(e){
    console.log('点击多个生产日期');
    //1、处理模型参数
    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = this.data.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    //2、传递模型(转换json字符串)
    var listModelString = JSON.stringify(listModel);
    wx.navigateTo({
      url: '/pages/drugStore/InitDrug/addBatchList/addBatchList?listModel=' + listModelString,
    });
  },

  /**
   * 选择失效日期
   */
  bindChooseExpireDate:function(e) {
    console.log('选择失效日期');
    console.log(e);
    //选取的日期
    var val = e.detail.value;
    //当前的位置
    var currentIndex = e.target.dataset.index;
    //刷新模型
    var beginJson = this.data.listModel.begin_json;
    var dict = beginJson[currentIndex];
    dict.expire_date = val;
    //刷新界面
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 输入库存
   */
  localCountInput:function(e){
    console.log('输入库存');
    console.log(e.detail.value);
    //输入的数值
    var value = e.detail.value;
    //当前的位置
    var currentIndex = e.target.dataset.index;
    //刷新模型
    var beginJson = this.data.listModel.begin_json;
    var dict = beginJson[currentIndex];
    dict.count = val;
    //刷新界面
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 取消弹出框图层
   */
  cancelHasMask: function (e) {
    this.data.hasMask = false;
    this.setData({
      hasMask: this.data.hasMask
    });
  },

  /**
   * 剂型/单位反向传值
   */
  clickDrugFormSureButton: function (e) {
    console.log('点击弹出框确定按钮(剂型)');
    console.log(e);
    //1、取值
    var itemDict = {
      id: e.detail.item.id,
      key_name: e.detail.item.key_name
    };
    //2、分类赋值
    if (e.detail.listType == 1){//剂型
      this.data.listModel.drug_forms_name = itemDict.key_name;
    } else if (e.detail.listType == 2){//处方单位
      this.data.listModel.min_name = itemDict.key_name;
      //判断当前是不是中药
      var drugType = this.data.listModel.dug_type ? this.data.listModel.dug_type.id : '';
      if(drugType != 3){//不是中药
        //刷新规格
        initDrugJs.dealSpec(this.data.listModel);
      }else{//是中药(三个单位统一)
        this.data.listModel.rx_name = itemDict.key_name;  
        this.data.listModel.single_name = itemDict.key_name;
      }
    } else if (e.detail.listType == 3) {//拆零单位
      this.data.listModel.rx_name = itemDict.key_name;
      //刷新规格
      initDrugJs.dealSpec(this.data.listModel);
    } else if (e.detail.listType == 4){//服用单位
      this.data.listModel.single_name = itemDict.key_name;
      //刷新规格
      initDrugJs.dealSpec(this.data.listModel);
    }else{//供应商
      this.data.listModel.vendor_id = itemDict;
    }
    //3、刷新界面
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 价格管理反向传值
   */
  priceManageBackData:function(data,target){
    if (target == 'cost'){//进货价
      this.data.listModel.cost = data;
    } else if (target == 'min_price'){//处方价(包装单位)
      this.data.listModel.min_price = data;
    } else if (target == 'sale_price'){//处方价(拆零单位)
      this.data.listModel.sale_price = data;
    } else if (target == 'retail_min_price'){//零售价(包装单位)
      this.data.listModel.retail_min_price = data;
    } else if (target == 'retail_sale_price') {//零售价(拆零单位)
      this.data.listModel.retail_sale_price = data;
    }else{//其余全部设置为进货价  
      this.data.listModel.cost = data;  
    }
  },

  /**
   * 用法用量反向传值
   */
  usageManageBackData: function (data, target){
    console.log('用法用量反向传值用法用量反向传值');
    if (target == 'usage'){//用法
      this.data.listModel.usage = data;
    } else if (target == 'instruction_en_name'){//西药用法
      this.data.listModel.instruction_en_name = data;
    } else if (target == 'common_frequency'){//西药频率
      this.data.listModel.common_frequency = data;
    } else if (target == 'common_count'){//西药单次用量
      this.data.listModel.common_count = data;
    } else if (target == 'common_days'){//西药用药天数
      this.data.listModel.common_days = data;
    } else if (target == 'instruction_zh_name'){//中药用法
      this.data.listModel.instruction_zh_name = data;
    }else{//其余设置为用法
      this.data.listModel.usage = data;    
    }
    //刷新界面
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 生产批次反向传值
   */
  batchListBackData:function(data){
    //json字符串解析
    var json = JSON.parse(data);
    //赋值
    this.data.listModel.begin_json = [];
    this.data.listModel.begin_json = json;
    //刷新界面
    this.setData({
      listModel: this.data.listModel
    });
    console.log('生产批次反向传值------');
    console.log(this.data.listModel.begin_json);
  },

  /**
   * 点击保存按钮
   */
  clickSureButton:function(e){
    console.log('点击保存按钮点击保存按钮');
    //参数校验
    if (!this.checkParam()){
      return;
    }
    //修改网络请求
    wx.showLoading({
      title: '正在保存中...',
    });
    initDrugJs.postAllData(this.data.listModel, this.data.isEdit,function(success){
      wx.hideLoading();
      //界面全部刷新
      //1、获取目标控制器
      //获取所有界面
      var pages = getCurrentPages();
      //当前页面
      var currPage = pages[pages.length - 1];
      //上一个页面
      var prevPage = pages[pages.length - 2];
      //2、刷新界面(这里要判断界面、因为有多种不同的路径)
      if (prevPage.route == "pages/drugStore/PutinStock/main/WWDrugPutinStock"){
        prevPage.completeInitDrug();
      }else{//药品初始化界面
        prevPage.refreshData();
      }
      //3、返回界面
      wx.showToast({
        title: '保存成功',
      });
      setTimeout(function () {
        wx.navigateBack({
        });
      }, 1000);
    },function(fail){
       wx.hideLoading();
       wx.showToast({
         title: fail,
       }); 
    });
  },

  /**
   * 校验参数
   */
  checkParam:function(){
    //1、通用名
    if(!this.data.listModel.common_name){
      wx.showToast({
        title: '请输入药品通用名',
      });
      return false;
    }
    //2、生产厂家
    if (!this.data.listModel.manufacturer_name){
      wx.showToast({
        title: '请选择药品厂商',
      });
      return false;
    }
    //3、条形码(西药和中成药)
    var drugType = this.data.listModel.dug_type ? this.data.listModel.dug_type.id : 1;
    if ((drugType == 1) || (drugType == 2)){
      if (!this.data.listModel.uuid){
        wx.showToast({
          title: '请输入条形码',
        });
        return false;
      }
    }
    //4、剂型(除了医疗器械)
    if(drugType != 4){
      if (!this.data.listModel.drug_forms_name){
        wx.showToast({
          title: '请先选择剂型',
        });
        return false;
      }
    }
    //5、包装单位
    if(!this.data.listModel.min_name){
      wx.showToast({
        title: '请先选择进货单位',
      });
      return false;
    }
    //6、处方单位
    if (!this.data.listModel.rx_name){
      wx.showToast({
        title: '请先选择处方单位',
      });
      return false;
    }
    //7、包装单位与拆临单位换算
    if(!this.data.listModel.change_count){
      wx.showToast({
        title: '请先输入单位换算',
      });
      return false;
    }
    //8、剂量单位(除了医疗器械)
    if (drugType != 4){
      if(!this.data.listModel.single_name){
        wx.showToast({
          title: '请先选择服用单位',
        });
        return false;
      }
    }
    //9、拆零单位与剂量单位换算(除了医疗器械)
    if (drugType != 4){
      if(!this.data.listModel.taking_count){
        wx.showToast({
          title: '服用比例必须大于0',
        });
        return false;
      }
    }
    //10、规格(西药和中成药)
    if ((drugType == 1) || (drugType == 2)){
      if(!this.data.listModel.spec){
        wx.showToast({
          title: '请先输入规格',
        });
        return false;
      }
    }
    //11、仓库
    var warehouseId = this.data.listModel.warehouse_id ? this.data.listModel.warehouse_id.id : 0;
    if (warehouseId == 0){
      wx.showToast({
        title: '请先选择仓库',
      });
      return false;
    }
    //12、供应商 vendor_name
    var vendorId = this.data.listModel.vendor_id ? this.data.listModel.vendor_id.id : 0;
    if (vendorId == 0) {
      wx.showToast({
        title: '请先选择供应商',
      });
      return false;
    }
    //最后返回
    return true;
  }
})