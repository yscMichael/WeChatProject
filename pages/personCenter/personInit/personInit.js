//index.js
//获取应用实例
const app = getApp()
//网络请求
var personJs = require('../../../api/personCenterRequest/personCenterRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_inventory: true, //是否开启库存
    is_price: true,//是否使用药品价格
    print_price: true,//是否打印处方总价
    print_extra_charge: true, //是否打印附加费
    is_sure: true,//出入库是否审核
    print_retail_price: true //是否打印售药单总价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '正在初始化数据',
    })
    //请求数据
    personJs.loadInitData(function(success){
      //处理数据
      that.data.is_inventory = success.is_inventory == 1 ? true : false;
      that.data.is_price = success.is_price == 1 ? true : false;
      that.data.print_price = success.print_price == 1 ? true : false;
      that.data.print_extra_charge = success.print_extra_charge == 1 ? true : false;
      that.data.is_sure = success.is_sure == 1 ? true : false;
      that.data.print_retail_price = success.print_retail_price == 1 ? true : false;
      //刷新界面
      that.setData({
        is_inventory: that.data.is_inventory,
        is_price: that.data.is_price,
        print_price: that.data.print_price,
        print_extra_charge: that.data.print_extra_charge,
        is_sure: that.data.is_sure,
        print_retail_price: that.data.print_retail_price
      });
      //停止加载动画
      wx.hideLoading();
    },function(fail){
      //停止加载动画
      wx.hideLoading();
      wx.showToast({
        title: '网络加载失败...',
      });
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
   * 是否开启库存
   */
  changeInventory: function(){
    this.data.is_inventory = !this.data.is_inventory;
    this.changeState();
  },
  /**
   * 是否使用药品价格
   */
  changePrice: function(){
    this.data.is_price = !this.data.is_price;
    this.changeState();
  },
  /**
   * 是否打印处方总价
   */
  changePrintPrice:function(){
    this.data.print_price = !this.data.print_price;
    this.changeState();
  },
  /**
   * 是否打印附加费用
   */
  changePrintExtraPrice:function(){
    this.data.print_extra_charge = !this.data.print_extra_charge;
    this.changeState();
  },
  /**
   * 出入库是否审核
   */
  changeSure:function(){
    this.data.is_sure = !this.data.is_sure;
    this.changeState();
  },
  /**
   * 是否打印售药单总价
   */
  changePrintRetailPrice:function(){
    this.data.print_retail_price = !this.data.print_retail_price;
    this.changeState(); 
  },
  /**
   * 修改状态
   */
  changeState:function(){
    wx.showLoading({
      title: '',
    })
    //构造参数
    var param = {
      is_inventory: (this.data.is_inventory == true) ? 1 : 0 ,
      is_price: (this.data.is_price == true) ? 1 : 0,
      print_price: (this.data.print_price == true) ? 1 : 0,
      print_extra_charge: (this.data.print_extra_charge == true) ? 1 : 0,
      is_sure: (this.data.is_sure == true) ? 1 : 0,
      print_retail_price: (this.data.print_retail_price == true) ? 1 : 0,
    };
    //网络请求
    personJs.changeInitData(param,function(success){
      wx.hideLoading();
    },function(fail){
      wx.hideLoading();
      wx.showToast({
        title: '网络加载失败',
      })
    });
  }
})