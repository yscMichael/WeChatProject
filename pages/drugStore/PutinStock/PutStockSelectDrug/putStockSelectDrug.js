//获取应用实例
const app = getApp()
//网络请求
var putinStockJs = require('../../../../api/drugRequest/drugRequest.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //药品类型
    drygtype: 0,
    //页数
    page: 1,
    //数据总数
    totalCount: 0,
    //是否显示底部加载
    isHideBottomView: true,
    //药品列表
    dataSource: [],
    //上级界面传过来已选的数组
    firstArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1、初始化数据
    this.initData(options);
    //2、刷新数据
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
   * 初始化数据
   */
  initData: function (options){
    //1、药品类型
    this.data.drugtype = options.id;
    //2、药品数组    
    var drugArr = JSON.parse(options.drugArr);
    if (drugArr.length > 0) {
      //2.1、image的url要进行解码
      for (let i = 0; i < drugArr.length; i++) {
        var model = drugArr[i];
        model.image = decodeURIComponent(model.image);
      }
      //2.2、数组赋值
      this.data.firstArray = this.data.firstArray.concat(drugArr);
    }
  },

  /**
   * 下拉刷新数据
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
    });
    this.loadData();
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
      this.data.page ++;
      //3、显示底部动画
      this.data.isHideBottomView = false;
      this.setData({
        isHideBottomView: this.data.isHideBottomView,
      });
      //4、开始网络请求
      this.loadData();  
    }
  },
  /**
   * 网络请求
   */
  loadData:function(){
    //1、网络请求、加载数据
    var that = this;
    putinStockJs.downloadDrugListRequest(this.data.drugtype, this.data.page,
      function (success, totalCount) {
        //总数赋值
        that.data.totalCount = totalCount;
        //添加元素
        that.data.dataSource = that.data.dataSource.concat(success);
        //刷新界面
        that.setData({
          dataSource: that.data.dataSource,
        });
        //处理动画
        that.dealNetWorkFinish();
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        });
        //处理动画
        that.dealNetWorkFinish();
      });
  },

  /**
   * 处理网络请求结束
   */
  dealNetWorkFinish:function(){
    //停止下拉刷新动画
    wx.stopPullDownRefresh();
    //停止显示加载动画
    wx.hideLoading();
    //停止底部动画
    this.data.isHideBottomView = true;
    this.setData({
      isHideBottomView: this.data.isHideBottomView,
    });
  },

  /**
   * cell点击事件
   */
  putinStockDrugCellClick:function(e) {
    var that = this;
    //1.获取点击对象的内容
    var drugModel = e.currentTarget.dataset.drugmodel;
    drugModel.is_select = !drugModel.is_select;
    //2.判断选中数量
    var count = 0;
    for(let i = 0; i < this.data.dataSource.length; i ++){
      var model = this.data.dataSource[i];
      if (model.drugId == drugModel.drugId){//id一致
         model.is_select = drugModel.is_select;
      }
      if(model.is_select){//计算数量
        count ++;
      }
    }
    //3.重新给数组赋值
    this.setData ({
      dataSource: this.data.dataSource,
      selectCount: count
    })
  },

  /**
   * 添加完毕点击事件
   */
  finishSelectDrug: function() {
    //1、选中数组
    var selectArr = [];
    for (let i = 0; i < this.data.dataSource.length; i++) {
      var model = this.data.dataSource[i];
      if(model.is_select) {
        selectArr.push(model);
      }
    }
    //2、判断数量是否大于0
    if (selectArr.length > 0) {
      this.data.firstArray = this.data.firstArray.concat(selectArr);
      var controllers = getCurrentPages();
      //获取上一个界面
      var parents = controllers[controllers.length - 2];
      if (parents.__route__ == "pages/drugStore/PutinStock/main/WWDrugPutinStock") {
        //调用上级界面的回调方法传值
        parents.changeDataFromNextController(this.data.firstArray);
        wx.navigateBack({
          delta: 1,
        })
      }
    }
    else {
      wx.showToast({
        title: '请选择药品',
        icon: 'none'
      })
    }
  }
})