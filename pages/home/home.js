//获取应用实例
const app = getApp()
//网络请求
var homeJs = require('../../api/homeRequest/homeRequest.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,//是否显示轮播图
    indicatorDots: true,//轮播图是否显示指示点
    autoplay: true,//是否自动播放
    circular: true,//是否循环播放
    interval: 2000,
    duration: 500,
    imageArray: [],//轮播图数组
    swiperCurrent:0,
    firstJump:false//是否是第一跳转
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.1、网络请求轮播图数据
    var that = this;
    homeJs.loadScrollViewRequest(function (success) {
      //清空当前数据
      that.data.imageArray = [];
      //添加数据
      that.data.imageArray = success;
      //是否显示轮播图
      that.data.isShow = (that.data.imageArray.length != 0) ? true : false;
      //刷新界面
      that.setData({
        isShow: that.data.isShow,
        imageArray: that.data.imageArray
      })
    },
    function (fail) {
      wx.showToast({
        title: '网络加载失败',
      })
    })
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
    this.setData({ 
      firstJump: true 
    });
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

  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //轮播图点击事件
  swipclick: function (e) {
    console.log('轮播图点击事件');
    console.log(this.data.swiperCurrent);
    //进入的轮播图详情界面
    var scrollModel = this.data.imageArray[this.data.swiperCurrent];
    var title = scrollModel.key_name;//标题
    var url = scrollModel.url;//详情地址
    wx.navigateTo({
      url: '../home/scrollDetail/scrollDetail?title=' + title + '&url=' + url
    })
  },
  //点击输入框搜索按钮
  searchBtn: function () {
    var that = this;
    if (that.data.firstJump){
      that.setData({
        firstJump: false
      });
      wx.navigateTo({
        url: '/pages/clinic/patient/patientList/patientList',
      })
    }
  },

})

