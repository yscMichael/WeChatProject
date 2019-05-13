//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listModel:'',//药品模型
    selectImage:'/image/drughome/wj_initdrug_normal.png',//图片数组
    imageTipTitle:'上传药品图片',
    hasMask:false,//是否有蒙层
    drugTypeArray:['西药','中药'],//药品类型
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
    priceItem:'',
    manufacturerArray:[],//联想厂商
    isHidePopManufacturer:true,//是否隐藏联想列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function  (options) {
    console.log('options----药品初始化详情');
    console.log(options);
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
    //3、初始化数据
    var listModel = JSON.parse(options.listModel);  
    this.initData(listModel);
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
   * 数据初始化
   */
  initData:function(listModel){
    //1、对图片进行特殊处理
    if (listModel.image != '/image/img_ypmr.png') {
      listModel.image = decodeURIComponent(listModel.image);
      this.data.selectImage = listModel.image;
      this.data.imageTipTitle = "点击查看大图";
      this.setData({
        selectImage: this.data.selectImage,
        imageTipTitle: this.data.imageTipTitle
      });
    }  
    //2、模型赋值
    this.data.listModel = listModel;
    this.setData({
      listModel: this.data.listModel
    });

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
  },

  /**
   * 生产厂家输入
   */
  manufacturerInput:function(e){
    console.log('生产厂家输入----');
    console.log(e);
  },

  /**
   * 点击生产厂家联想列表
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
   * 条形码输入
   */
  uuidInput:function(e){
    console.log('条形码输入');
  },

  /**
   * 扫描条形码
   */
  scanCode:function(e){
    console.log('扫描条形码');
    const that = this
    wx.scanCode({
      success(res) {
        that.data.resultCode = res.result;
        that.setData({
          resultCode: that.data.resultCode
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
    const val = e.detail.value
    this.setData({
      drugTypeIndex: e.detail.value
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
   * 选择包装单位
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
  },

  /**
   * 价格管理
   */
  choosePrice: function (e) {
    console.log('价格管理=======');
    console.log(this.data.priceItem);
    //1、传递模型参数
    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = this.data.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(listModel);
    wx.navigateTo({
      url: '/pages/drugStore/InitDrug/initDrugPriceManager/initDrugPriceManager?listModel=' + listModelString,
    });
  },

  /**
   * 用法用量 
   */
  chooseUsage: function (e) {
    wx.navigateTo({
      url: '/pages/drugStore/InitDrug/initDrugUsage/initDrugUsage',
    })
  },

  /**
   * 有效期预警
   */
  bindValidityChange: function (e) {
    const val = e.detail.value
    this.setData({
      validityIndex: e.detail.value
    });
  },

  /**
   * 库存安全范围--下限
   */
  lowCountInput:function(e){
    console.log('库存安全范围--下限');
  },

  /**
   * 库存安全范围--上限
   */
  upCountInput:function(e){
    console.log('库存安全范围--上限');
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
   * 点击弹出框确定按钮(剂型、单位)
   */
  clickDrugFormSureButton: function (e) {
    console.log('点击弹出框确定按钮(剂型)');
    console.log(e);
    console.log(e.detail.item);
    //1、取值
    var itemDict = {
      id: e.detail.item.drugformId,
      key_name: e.detail.item.key_name
    };
    //2、判断类型并赋值
    if (e.detail.listType == 1){//剂量
      this.data.listModel.drug_forms = itemDict;
    } else if (e.detail.listType == 2){//处方单位
      this.data.listModel.min_unit = itemDict;
    } else if (e.detail.listType == 3){//拆零单位
      this.data.listModel.rx_unit = itemDict;
    }else{//剂量单位
      this.data.listModel.single_unit = itemDict;
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
   * 点击保存按钮
   */
  clickSureButton:function(e){
    console.log('点击保存按钮点击保存按钮');
    //修改网络请求
    initDrugJs.postAllData(this.data.listModel, 1,function(success){

    },function(fail){

    });
  }
})