//index.js
//获取应用实例
const app = getApp()
//网络请求
var loginJs = require('../../api/loginRequest/loginRequest.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },

  onLoad: function () {

  },

  //获取用户登陆信息
  clickLoginButton: function(e) {
    wx.showLoading({
      title: '正在登陆...',
    })

    loginJs.loginRequest(app.globalData.username, 
                         app.globalData.password, 
    function (success){
      wx.hideLoading();
      //跳转界面
      wx.switchTab({ url: '/pages/home/home' })
    },
    function(fail){
      wx.showToast({
        title: "网络请求失败",
      })
    });
  }
})
