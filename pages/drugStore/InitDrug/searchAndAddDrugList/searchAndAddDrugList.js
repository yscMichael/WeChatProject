//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    page: 1,
    rows: 15,
    totalCount: 0,
    keyword:'',//搜索关键字
    dug_type:'',//药品类型
    isHideTopView: false,//是否隐藏顶部下拉刷新框
    isHideBottomView: true,//是否隐藏底部上拉加载框
    isHiddenNoData: false,//是否隐藏无数据提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.keyword = 'y';
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
   * 点击开始搜索
   */
  searchBtn:function(){
    console.log('点击开始搜索------');
    
  },

  /**
   * 点击cell、跳转到编辑界面
   */
  onClickCell(e) {
    console.log('点击cell、跳转到编辑界面');
    //1、取值
    var index = e.currentTarget.dataset.index;
    var model = this.data.dataSource[index];
    //2、检查药品是否已经初始化
    this.checkDrugIsInit(model);
  },

  /**
   * 查询某个药品是否已经初始化过
   */
  checkDrugIsInit:function(model){
    console.log('查询某个药品是否已经初始化过----');
    var that = this;
    var common_name = model.common_name ? model.common_name : '';
    var manufacturerId = model.manufacturer ? model.manufacturer.id : '';
    initDrugJs.loadDrugInfoFirstByNameAndCompany(common_name, manufacturerId,
    function(success){
      if (success == 202){//不能跳转、给出提示
        wx.showToast({
          title: '药品已初始化过，请勿重新添加',
        });
      }else if(success == 200){//跳转、isEdit=NO
        that.goToDetailInit(model);
      }else{//归为网络加载失败
        wx.showToast({
          title: '网络加载失败',
        });
      }
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      });
    });
  },

  /**
   * 跳转到药品初始化详情
   */
  goToDetailInit: function (listModel){
    console.log('跳转到药品初始化详情');
    //1、这里要对image进行特殊编码(防止出现特殊字符)
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    //2、导航
    var listModelString = JSON.stringify(listModel);
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?listModel=" + listModelString + '&isEdit=0',
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
   * 网络请求
   */
  loadData: function () {
    //1、网络请求、加载数据
    var that = this;
    console.log('网络请求网络请求网络请求');
    console.log(this.data.keyword);
    initDrugJs.searchDrugFromBasis(this.data.keyword, this.data.dug_type,this.data.page, this.data.rows, 
      function (success, totalCount){
      console.log('totalCounttotalCounttotalCounttotalCount');
      console.log(totalCount);
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
      //无数据
      that.dealNoData();
      that.setData({
        isHideBottomView: that.data.isHideBottomView,
      });
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      });
      //停止下拉刷新动画
      wx.stopPullDownRefresh();
      //停止显示加载动画
      wx.hideLoading();
      //停止底部动画
      that.data.isHideBottomView = true;
      //无数据
      that.dealNoData();
      that.setData({
        isHideBottomView: that.data.isHideBottomView,
      });
    });
  },

  /**
   * 处理无数据
   */
  dealNoData: function () {
    //处理无数据
    if (this.data.dataSource.length == 0) {
      this.data.isHiddenNoData = false;
    } else {
      this.data.isHiddenNoData = true;
    }
    this.setData({
      isHiddenNoData: this.data.isHiddenNoData
    });
  }

})