//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',//搜索关键字
    isHideSendingList: false,//是否隐藏待发药列表
    isHideSendedList: true,//是否隐藏已发药列表
    currentIndex: 0,//当前切换的按钮
    //按钮颜色切换
    sendingButtonColor: 'blue',
    sendedButtonColor: 'black',
    sendingBottomColor: "blue",
    sendedBottomColor: "white"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent("#sendingList").sendingRefresh();
    this.selectComponent("#sendedList").sendedRefresh();
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
    //1、根据按钮、判断调用方法(下拉动画会一直显示)
    if (this.data.currentIndex === 0) {//待发药列表
      this.selectComponent("#sendingList").sendingRefresh();
    } else {
      this.selectComponent("#sendedList").sendedRefresh();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1、根据按钮、判断调用方法
    if (this.data.currentIndex === 0) {//带发药列表
      this.selectComponent("#sendingList").sendingLoadMore();
    } else {
      this.selectComponent("#sendedList").sendedLoadMore();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击待发药按钮
   */
  clickSendingButton: function (event) {
    //1、设置按钮颜色
    this.data.sendingButtonColor = 'blue';
    this.data.sendingBottomColor = 'blue';
    this.data.sendedButtonColor = 'black';
    this.data.sendedBottomColor = 'white';
    //2、设置显示待收费列表
    this.data.isHideSendingList = false;
    this.data.isHideSendedList = true;
    this.data.currentIndex = 0;
    //3、刷新界面
    this.setData({
      sendingButtonColor: this.data.sendingButtonColor,
      sendingBottomColor: this.data.sendingBottomColor,
      sendedButtonColor: this.data.sendedButtonColor,
      sendedBottomColor: this.data.sendedBottomColor,
      isHideSendingList: this.data.isHideSendingList,
      isHideSendedList: this.data.isHideSendedList
    });
  },
  /**
   * 点击已收费列表
   */
  clickSendedButton: function (event) {
    //1、设置按钮颜色
    this.data.sendingButtonColor = 'black';
    this.data.sendingBottomColor = 'white';
    this.data.sendedButtonColor = 'blue';
    this.data.sendedBottomColor = 'blue';
    //2、设置显示转诊患者界面
    this.data.isHideSendingList = true;
    this.data.isHideSendedList = false;
    this.data.currentIndex = 1;
    //3、刷新界面
    this.setData({
      sendingButtonColor: this.data.sendingButtonColor,
      sendingBottomColor: this.data.sendingBottomColor,
      sendedButtonColor: this.data.sendedButtonColor,
      sendedBottomColor: this.data.sendedBottomColor,
      isHideSendingList: this.data.isHideSendingList,
      isHideSendedList: this.data.isHideSendedList
    });
  },
  /**
   * 网络请求完成
   */
  _netWorkSuccess: function () {
    wx.stopPullDownRefresh();
  },
  /**
   * 点击待发药cell
   */
  onClickSendingCell: function (e) {
    wx.navigateTo({
      url: '/pages/clinic/send/sendDetail/sendDetail?id=' + e.detail.recordId + '&isSending=' + e.detail.isSending,
    })
  },
  /**
   * 点击已发药cell
   */
  onClickSendedCell: function (e) {
    wx.navigateTo({
      url: '/pages/clinic/send/sendDetail/sendDetail?id=' + e.detail.recordId + '&isSending=' + e.detail.isSending,
    })
  }
})
