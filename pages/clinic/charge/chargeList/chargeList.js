//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',//搜索关键字
    isHideChargingList: false,//是否隐藏待收费列表
    isHideChargedList: true,//是否隐藏已收费列表
    currentIndex: 0,//当前切换的按钮
    //按钮颜色切换
    chargingButtonColor: 'blue',
    chargedButtonColor: 'black',
    chargingBottomColor: "blue",
    chargedBottomColor: "white"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent("#chargingList").chargingRefresh();
    this.selectComponent("#chargedList").chargedRefresh();
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
    if (this.data.currentIndex === 0) {//待收费列表
      this.selectComponent("#chargingList").chargingRefresh();
    } else {
      this.selectComponent("#chargedList").chargedRefresh();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1、根据按钮、判断调用方法
    if (this.data.currentIndex === 0) {//待收费列表
      this.selectComponent("#chargingList").chargingLoadMore();
    } else {
      this.selectComponent("#chargedList").chargedLoadMore();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击待收费按钮
   */
  clickChargingButton: function (event) {
    //1、设置按钮颜色
    this.data.chargingButtonColor = 'blue';
    this.data.chargingBottomColor = 'blue';
    this.data.chargedButtonColor = 'black';
    this.data.chargedBottomColor = 'white';
    //2、设置显示待收费列表
    this.data.isHideChargingList = false;
    this.data.isHideChargedList = true;
    this.data.currentIndex = 0;
    //3、刷新界面
    this.setData({
      chargingButtonColor: this.data.chargingButtonColor,
      chargingBottomColor: this.data.chargingBottomColor,
      chargedButtonColor: this.data.chargedButtonColor,
      chargedBottomColor: this.data.chargedBottomColor,
      isHideChargingList: this.data.isHideChargingList,
      isHideChargedList: this.data.isHideChargedList
    });
  },
  /**
   * 点击已收费列表
   */
  clickChargedButton: function (event) {
    //1、设置按钮颜色
    this.data.chargingButtonColor = 'black';
    this.data.chargingBottomColor = 'white';
    this.data.chargedButtonColor = 'blue';
    this.data.chargedBottomColor = 'blue';
    //2、设置显示转诊患者界面
    this.data.isHideChargingList = true;
    this.data.isHideChargedList = false;
    this.data.currentIndex = 1;
    //3、刷新界面
    this.setData({
      chargingButtonColor: this.data.chargingButtonColor,
      chargingBottomColor: this.data.chargingBottomColor,
      chargedButtonColor: this.data.chargedButtonColor,
      chargedBottomColor: this.data.chargedBottomColor,
      isHideChargingList: this.data.isHideChargingList,
      isHideChargedList: this.data.isHideChargedList
    });
  },
  /**
   * 网络请求完成
   */
  _netWorkSuccess: function () {
    wx.stopPullDownRefresh();
  },
  /**
   * 点击待收费cell
   */
  onClickChargingCell:function(e){
    //进入到收费发药界面
    wx.navigateTo({
      url: '/pages/clinic/charge/chargeDetail/chargeDetail?id=' + e.detail.recordId + '&isCharging=' + e.detail.isCharging,
    })
  },
  /**
   * 点击已收费cell
   */
  onClickChargedCell:function(e){
    //进入到收费详情界面
    wx.navigateTo({
      url: '/pages/clinic/charge/chargeDetail/chargeDetail?id=' + e.detail.recordId + '&isCharging=' + e.detail.isCharging,
    })
  }
})
