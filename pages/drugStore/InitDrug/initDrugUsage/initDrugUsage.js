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
    instruction:'',//用法
    common_frequency:'',//频率
    singleUse:'',//单次用量
    common_days:'',//用药天数
    totalTitle:'',//顶部内容
    selected:false,//每次适量按钮是否被选中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //1、获取用法列表
    initDrugJs.getUsageList(function(success){
      that.data.usageArray = that.data.usageArray.concat(success);
      that.setData({
        usageArray: that.data.usageArray
      });
    },function(fail){
      wx.showToast({
        title: fail,
      })
    });
    //2、获取频率列表
    initDrugJs.getFrequencyList(function(success){
      that.data.frequencyArray = that.data.frequencyArray.concat(success);
      that.setData({
        frequencyArray: that.data.frequencyArray
      });
    },function(fail){
      wx.showToast({
        title: fail,
      })
    });

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
   * 点击用法
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
    this.data.instruction = item;
    //4、刷新界面
    this.setData({
      usageArray: this.data.usageArray,
      instruction: this.data.instruction
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
    this.data.common_frequency = item;
    //4、刷新界面
    this.setData({
      frequencyArray: this.data.frequencyArray,
      common_frequency: this.data.common_frequency
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

    this.data.singleUse = e.detail.value;
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
      this.data.singleUse = -1;
    }
    this.setData({
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
  
    this.data.common_days = e.detail.value;
    //顶部标题刷新
    this.refreshHeadTitle();
  },

  /**
   * 刷新顶部内容
   */
  refreshHeadTitle:function(e){
    var resultArray = [];
    //用法
    this.data.instruction ? resultArray.push(this.data.instruction.key_name) : '';
    //频率
    this.data.common_frequency ? resultArray.push(this.data.common_frequency.key_name) : '';
    //单次用量
    var singleUseString = '每次' + this.data.singleUse + '片';
    if(this.data.singleUse == -1){
      singleUseString = '每次适量';
    }
    this.data.singleUse ? resultArray.push(singleUseString) : '';
    //用药天数
    var dayString = '用药' + this.data.common_days + '天';
    this.data.common_days ? resultArray.push(dayString) : '';
    //整合
    this.data.totalTitle = resultArray.join(';');
    this.setData({
      totalTitle: this.data.totalTitle
    });
  },
  
})