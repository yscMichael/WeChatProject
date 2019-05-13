//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usageArray:[],//用法数组
    frequencyArray: [],//频率数组
    currentUsageIndex:0,//当前用法位置
    currentFrequencyIndex:0,//当前频率位置

    listModel: '',//模型
    selected:false,//每次适量按钮是否被选中
    isWestDrug:true,//是否是西药
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //1、解析模型
    var listModel = JSON.parse(options.listModel);
    //2、判断界面类型
    var dugType = listModel.dug_type ? listModel.dug_type.id : 1;
    if ((parseInt(dugType) == 1) || (parseInt(dugType) == 2)){//西药和中成药
      this.data.isWestDrug = true;
    }else{
      this.data.isWestDrug = false;
    }
    this.data.listModel = listModel;
    //3、刷新界面
    this.setData({
      isWestDrug: this.data.isWestDrug,
      listModel: this.data.listModel
    });
    //4、网络请求
    //请求用法列表
    this.loadWestUsageListData();
    //请求频率列表
    this.loadWestFrequencyListData();

    console.log('生命周期函数--监听页面加载');
    console.log(listModel);
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
   * 请求用法(西药)
   */
  loadWestUsageListData:function(){
    var that = this;
    initDrugJs.getUsageList(function (success) {
      that.data.usageArray = that.data.usageArray.concat(success);
      //刷新界面
      that.setData({
        usageArray: that.data.usageArray
      });
      //选中问题
      that.dealWestUsageIsSelectedData();
    }, function (fail) {
      wx.showToast({
        title: fail,
      })
    });
  },

  /**
   * 请求频率
   */
  loadWestFrequencyListData:function(){
    var that = this;
    initDrugJs.getFrequencyList(function (success) {
      that.data.frequencyArray = that.data.frequencyArray.concat(success);
      //刷新界面
      that.setData({
        frequencyArray: that.data.frequencyArray
      });
      //选中问题
      that.dealWestFrequencyIsSelectedData();
    }, function (fail) {
      wx.showToast({
        title: fail,
      })
    });
  },

  /**
   * 处理用法选中问题
   */
  dealWestUsageIsSelectedData:function(){
    //1、寻找选中
    var targetName = this.data.listModel.instruction_en_name;
    for (let i = 0; i < this.data.usageArray.length; i ++){
        var usageModel = this.data.usageArray[i];
      if (usageModel.key_name == targetName){//选中
          usageModel.is_select = true;
        }
    }
    //2、再次刷新界面
    this.setData({
      usageArray: this.data.usageArray
    });
  },

  /**
   * 处理频率选中问题
   */
  dealWestFrequencyIsSelectedData:function(){
    //1、寻找选中
    var targetName = this.data.listModel.common_frequency ? this.data.listModel.common_frequency.key_name : '';
    for (let i = 0; i < this.data.frequencyArray.length; i++) {
      var frequencyModel = this.data.frequencyArray[i];
      if (frequencyModel.key_name == targetName) {//选中
        frequencyModel.is_select = true;
      }
    }
    //2、刷新界面
    this.setData({
      frequencyArray: this.data.frequencyArray
    });
  },

  /**
   * 点击用法(西药)
   */
  clickUsageChild:function(e){
    console.log('点击用法---');
    console.log(e.currentTarget.dataset.index);
    //1、将之前选中的取消选中
    var previousItem = this.data.usageArray[this.data.currentUsageIndex];
    previousItem.is_select = false;
    //2、重新设置选中
    var item = this.data.usageArray[e.currentTarget.dataset.index];
    item.is_select = true;
    //3、记住当前位置
    this.data.currentUsageIndex = e.currentTarget.dataset.index;
    console.log(item);
    this.data.listModel.instruction_en_name = item.key_name;
    //4、刷新界面
    this.setData({
      usageArray: this.data.usageArray,
      listModel: this.data.listModel
    });
    //5、顶部标题刷新
    this.refreshHeadTitle();
  },

  /**
   * 点击频率
   */
  clickFrequencyChild:function(e){
    console.log('点击频率---');
    console.log(e.currentTarget.dataset.index);
    //1、将之前选中的取消选中
    var previousItem = this.data.frequencyArray[this.data.currentFrequencyIndex];
    previousItem.is_select = false;
    //2、重新设置选中
    var item = this.data.frequencyArray[e.currentTarget.dataset.index];
    item.is_select = true;
    //3、记住当前位置
    this.data.currentFrequencyIndex = e.currentTarget.dataset.index;
    this.data.listModel.common_frequency = item;
    //4、刷新界面
    this.setData({
      frequencyArray: this.data.frequencyArray,
      listModel: this.data.listModel
    });
    //5、顶部标题刷新
    this.refreshHeadTitle();
  },

  /**
   * 单次用量输入
   */
  singleUseInput:function(e){
    console.log('单次用量输入');
    console.log(e);
    this.data.listModel.common_count = e.detail.value;
    if(this.data.listModel.common_count != -1){
        this.data.selected = false;
    }
    //刷新界面
    this.setData({
      selected: this.data.selected
    })
    //顶部标题刷新
    this.refreshHeadTitle();
  },

  /**
   * 点击每次适量
   */
  clicksingleUseButton:function(e){
    console.log('点击每次适量');
    this.data.selected = !this.data.selected;
    if(this.data.selected){
      this.data.listModel.common_count = -1;
    }
    this.setData({
      listModel: this.data.listModel,
      selected: this.data.selected
    });
    //顶部标题刷新
    this.refreshHeadTitle();
  },

  /**
   * 用药天数输入
   */
  dayCountInput:function(e){
    console.log('用药天数输入');
    console.log(e);
  
    this.data.listModel.common_days = e.detail.value;
    //顶部标题刷新
    this.refreshHeadTitle();
  },

  /**
   * 刷新顶部内容
   */
  refreshHeadTitle:function(e){
    var resultArray = [];
    //用法
    var instruction_en_name = this.data.listModel.instruction_en_name;
    instruction_en_name ? resultArray.push(instruction_en_name) : '';
    //频率
    var frequency = this.data.listModel.common_frequency ? this.data.listModel.common_frequency.key_name : '';
    frequency ? resultArray.push(frequency) : '';
    //单次用量
    var singleUseString = '每次' + this.data.listModel.common_count + '片';
    if (this.data.listModel.common_count == -1){
      singleUseString = '每次适量';
    }
    this.data.listModel.common_count ? resultArray.push(singleUseString) : '';
    //用药天数
    var dayString = '用药' + this.data.listModel.common_days + '天';
    this.data.listModel.common_days ? resultArray.push(dayString) : '';
    //整合
    this.data.listModel.usage = resultArray.join(';');
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 点击确定按钮
   */
  clickSaveButton:function(e){
    console.log('点击确定按钮-----------');
    //1、获取目标控制器
    //获取所有界面
    var pages = getCurrentPages();
    //当前页面
    var currPage = pages[pages.length - 1];
    //上一个页面
    var prevPage = pages[pages.length - 2];

    //2、参数处理(分类)
    if(this.data.isWestDrug){//是西药和中成药
      prevPage.usageManageBackData(this.data.listModel.usage,'usage');
      prevPage.usageManageBackData(this.data.listModel.instruction_en_name, 'instruction_en_name');
      prevPage.usageManageBackData(this.data.listModel.common_frequency, 'common_frequency');
      prevPage.usageManageBackData(this.data.listModel.common_count, 'common_count');
      prevPage.usageManageBackData(this.data.listModel.common_days, 'common_days');
    }else{//中药和医疗器械
      var dugType = this.data.listModel.dug_type ? this.data.listModel.dug_type.id : 3;
      if(dugType == 3){//中药
        prevPage.usageManageBackData(this.data.listModel.instruction_zh_name,'instruction_zh_name');
      }else{//医疗器械
        prevPage.usageManageBackData(this.data.listModel.instruction_en_name, 'instruction_en_name');
      }
    }
  },

})