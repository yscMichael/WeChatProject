//获取应用实例
const app = getApp()
//网络请求
var putinStockJs = require('../../../../api/drugRequest/drugRequest.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    drugtype: 0,//药品类型
    page: 1,
    rows: 15,
    totalCount: 0,
    isHideTopView: false,//是否隐藏顶部下拉刷新框
    isHideBottomView: true,//是否隐藏底部上拉加载框
    isHiddenNoData: false,//是否隐藏无数据提示
    isRefresh: false,//当前在下拉刷新(暂时不清空数据)
    isLoadingMore: false,//当前在上拉加载()
    isCurrentPage: 1,//保留当前页码    
    dataSource: [],//药品列表
    firstArray: [],//上级界面传过来已选的数组
    screenWidth: 0,//屏幕宽度
    screenHeight: 0//屏幕高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1、屏幕宽高
    var screenWidth = wx.getSystemInfoSync().windowWidth;
    var screenHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      screenWidth: screenWidth,
      screenHeight: (screenHeight - 60)
    });
    //2、初始化数据
    this.initData(options);
    //3、刷新数据
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
    //1、正在下拉刷新或者上拉加载，不能进行二次下拉刷新
    if (this.data.isRefresh || this.data.isLoadingMore) {
      return;
    }
    //2、显示动画框(隐藏上拉加载动画)
    this.data.isHideTopView = false;
    this.data.isHideBottomView = true;
    this.setData({
      isHideTopView: this.data.isHideTopView,
      isHideBottomView: this.data.isHideBottomView
    });
    //3、显示提示框
    wx.showLoading({
      title: '正在拼命加载数据...',
    });
    //4、数据初始化(暂时不清空数据、保证平稳过渡)
    this.data.isRefresh = true;
    //网络请求失败、将isCurrentPage赋值给page
    this.data.isCurrentPage = this.data.page;
    this.data.page = 1;
    //5、开始网络请求
    var that = this;
    setTimeout(function () {
      that.loadData();
    }, 500);
  },

  /**
   * 加载更多数据
   */
  loadMoreData: function () {
    var that = this;
    //1、正在下拉刷新或者上拉加载、不能二次上拉加载
    if (this.data.isRefresh || this.data.isLoadingMore) {
      return;
    }
    //2、判断是否可以加载更多数据
    if (this.data.totalCount <= this.data.dataSource.length) {
      wx.showToast({
        title: '无更多数据加载',
      });
    }
    else {
      //3、显示动画
      this.data.isHideBottomView = false;
      this.setData({
        isHideBottomView: this.data.isHideBottomView
      });
      //4、数据初始化
      this.data.isLoadingMore = true;
      this.data.page++;
      //5、开始网络请求  
      setTimeout(function () {
        that.loadData();
      }, 500);
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
        //如果是下拉刷新
        if (that.data.isRefresh) {
          that.data.isRefresh = !that.data.isRefresh;//解锁
          that.data.dataSource = [];//数据一定清空
        }
        //如果是上拉加载
        if (that.data.isLoadingMore) {
          that.data.isLoadingMore = !that.data.isLoadingMore;//解锁
        }
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
        //如果是下拉刷新
        if (that.data.isRefresh) {
          that.data.isRefresh = !that.data.isRefresh;//解锁
          that.data.page = that.data.isCurrentPage;//数据还原
        }
        //如果是上拉加载
        if (that.data.isLoadingMore) {
          that.data.isLoadingMore = !that.data.isLoadingMore;//解锁
        }
        //处理动画
        that.dealNetWorkFinish();
      });
  },

  /**
   * 处理网络请求结束
   */
  dealNetWorkFinish:function(){
    //停止显示加载动画
    wx.hideLoading();
    //停止底部动画
    this.data.isHideBottomView = true;
    this.data.isHideTopView = true;
    this.setData({
      isHideBottomView: this.data.isHideBottomView,
      isHideTopView: this.data.isHideTopView
    });
    //处理无数据
    if (this.data.dataSource.length == 0) {
      this.data.isHiddenNoData = false;
    } else {
      this.data.isHiddenNoData = true;
    }
    this.setData({
      isHiddenNoData: this.data.isHiddenNoData
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
  },

  /**
   * 下载图片失败
   */
  loadimage(e) {
    //1、重新给模型图片赋值(可以抽取成组件)
    var index = e.currentTarget.dataset.errorindex;
    var drugModel = this.data.dataSource[index];
    drugModel.image = '/image/img_ypmr.png';
    //2、刷新界面
    this.setData({
      dataSource:this.data.dataSource
    });
  },

  /**
   * 下拉刷新动作
   */
  upper: function (e) {
    console.log('下拉刷新动作');
    this.refreshData();
  },

  /**
   * 上拉加载动作
   */
  lower: function (e) {
    console.log('上拉加载动作');
    this.loadMoreData();
  },

})