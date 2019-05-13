//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    rows: 15,
    totalCount: 0,
    isHideBottomView: true,
    dataSource: [],//厂家数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载数据
    this.refreshData();
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
    //重新获取网络数据
    this.refreshData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //加载更多数据
    this.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 点击cell
   */
  clickItem:function(e){
    console.log('点击cell点击cell');
    console.log(e);
    console.log(e.currentTarget.dataset.item);
    //传递参数

    //返回上一个界面
    wx.navigateBack({
      
    });
  },

  /**
   * 刷新数据
   */
  refreshData: function () {
    //1、数据初始化
    this.data.dataSource = [];
    this.data.page = 1;
    this.data.totalCount = 0;
    this.setData({
      dataSource: this.data.dataSource,
      page: this.data.page,
      totalCount: this.data.totalCount,
    })
    //2、开始网络请求
    wx.showLoading({
      title: '正在拼命加载数据...',
    })
    var that = this;
    setTimeout(function () {
      that.loadData();
    }, 1000);
  },

  /**
   * 加载更多数据
   */
  loadMoreData: function () {
    //1、判断是否可以加载更多数据
    if (this.data.totalCount <= this.data.dataSource.length) {
      wx.showToast({
        title: '无更多数据加载',
      })
    }
    else {
      //2、数据初始化
      this.data.page++;
      //3、显示底部动画
      this.data.isHideBottomView = false;
      this.setData({
        isHideBottomView: this.data.isHideBottomView,
      });
      //4、开始网络请求  
      var that = this;
      setTimeout(function () {
        that.loadData();
      }, 1000);
    }
  },

  /**
   * 获取厂家列表
   */
  loadData: function () {
    //1、网络请求、加载数据
    var that = this;
    initDrugJs.loadManufacturerList(this.data.page,this.data.rows,
      function (success, totalCount) {
        //总数赋值
        that.data.totalCount = totalCount;
        //添加元素
        that.data.dataSource = that.data.dataSource.concat(success);
        //刷新界面
        that.setData({
          dataSource: that.data.dataSource,
        });
        //停止下拉刷新动画
        wx.stopPullDownRefresh();
        //停止显示加载动画
        wx.hideLoading();
        that.data.isHideBottomView = true;
        that.setData({
          isHideBottomView: that.data.isHideBottomView,
        });
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        });
        //停止下拉刷新动画
        wx.stopPullDownRefresh();
        //停止显示加载动画
        wx.hideLoading();
        //停止底部动画
        that.data.isHideBottomView = true;
        that.setData({
          isHideBottomView: that.data.isHideBottomView,
        });
      });
  },
})