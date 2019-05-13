//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key_name:'',
    department_entity:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.key_name = app.globalData.key_name;
    this.data.department_entity = app.globalData.department_entity;
    //刷新界面
    this.setData({
      key_name: this.data.key_name,
      department_entity: this.data.department_entity 
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
   * 点击我的消息
   */
  clickMessage:function(){
    wx.showToast({
      title: '正在开发中...',
    })
  },
  /**
   * 点击初始设置
   */
  clickInitButton:function(){
    wx.showToast({
      title: '点击初始设置...',
    });
    wx.navigateTo({
      url: '/pages/personCenter/personInit/personInit',
    })
  },
  /**
   * 点击退出登录
   */
  clickLogout:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})