//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideStoragingList: true,//是否隐藏待审核
    isHideStoragedList: false,//是否隐藏已审核
    currentIndex: 0,//当前切换的按钮
    //按钮颜色切换
    storagedButtonColor: 'blue',
    storagingButtonColor: 'black',
    storagedBottomColor: "blue",
    storagingBottomColor: "white",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent("#storagedList").storagedRefresh();
    this.selectComponent("#storagingList").storagingRefresh();
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
    if (this.data.currentIndex === 0) {//已审核列表
      this.selectComponent("#storagedList").storagedRefresh();
    } else {
      this.selectComponent("#storagingList").storagingRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentIndex === 0) {//已审核列表
      this.selectComponent("#storagedList").storagedLoadMore();
    } else {
      this.selectComponent("#storagingList").storagingLoadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 点击已审核列表
   */
  clickStoragedButton: function (event) {
    //1、设置按钮颜色
    this.data.storagingButtonColor = 'black';
    this.data.storagingBottomColor = 'white';
    this.data.storagedButtonColor = 'blue';
    this.data.storagedBottomColor = 'blue';
    //2、设置显示转诊患者界面
    this.data.isHideStoragingList = true;
    this.data.isHideStoragedList = false;
    this.data.currentIndex = 0;
    //3、刷新界面
    this.setData({
      storagingButtonColor: this.data.storagingButtonColor,
      storagingBottomColor: this.data.storagingBottomColor,
      storagedButtonColor: this.data.storagedButtonColor,
      storagedBottomColor: this.data.storagedBottomColor,
      isHideStoragingList: this.data.isHideStoragingList,
      isHideStoragedList: this.data.isHideStoragedList
    });
  },

  /**
   * 点击待审核按钮
   */
  clickStoragingButton: function (event) {
    //1、设置按钮颜色
    this.data.storagingButtonColor = 'blue';
    this.data.storagingBottomColor = 'blue';
    this.data.storagedButtonColor = 'black';
    this.data.storagedBottomColor = 'white';
    //2、设置显示待收费列表
    this.data.isHideStoragingList = false;
    this.data.isHideStoragedList = true;
    this.data.currentIndex = 1;
    //3、刷新界面
    this.setData({
      storagingButtonColor: this.data.storagingButtonColor,
      storagingBottomColor: this.data.storagingBottomColor,
      storagedButtonColor: this.data.storagedButtonColor,
      storagedBottomColor: this.data.storagedBottomColor,
      isHideStoragingList: this.data.isHideStoragingList,
      isHideStoragedList: this.data.isHideStoragedList
    });
  },

  /**
   * 网络请求完成
   */
  _netWorkSuccess: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 点击已审核cell
   */
  onClickStoragedCell: function (e) {
    //进入到审核详情界面
    var listString = JSON.stringify(e.detail.listModel);
    wx.navigateTo({
      url: '/pages/drugStore/PutinStock/storageDetail/storageDetail?id=' + e.detail.batchId + '&isStoraging=' + e.detail.isStoraging + '&listModel=' + listString,
    })
  },
  

  /**
   * 点击待审核cell
   */
  onClickStoragingCell: function (e) {
    //进入到审核详情界面
    var listString = JSON.stringify(e.detail.listModel);
    wx.navigateTo({
      url: '/pages/drugStore/PutinStock/storageDetail/storageDetail?id=' + e.detail.batchId + '&isStoraging=' + e.detail.isStoraging + '&listModel=' + listString,
    })
  },

  /**
   * 刷新已审核和已审核界面
   */
  refreshAllData:function(){
    this.selectComponent("#storagedList").refreshData();
    this.selectComponent("#storagingList").refreshData();
  },
})