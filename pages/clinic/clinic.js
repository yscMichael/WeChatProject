Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonTitleArray:[
      {
        title: "接诊列表",
        imageURL: "../../../image/clinic/treatButton.png"
      },
      {
        title: "患者列表",
        imageURL: "../../../image/clinic/patientButton.png"
      },
      {
        title: "转诊记录",
        imageURL: "../../../image/clinic/transferButton.png"
      }
    ],
    listTitleArray:[
      {
        title: "收费列表",
        subTitle:"当前等待收费的患者",
        imageURL:"../../../image/clinic/chargeList.png"
      },
      {
        title: "发药列表",
        subTitle: "当前等待发药的患者",
        imageURL: "../../../image/clinic/sendList.png"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  onMyEvent(e) {
    var titleString = e.currentTarget.dataset.item.title;
    if (titleString.indexOf("接诊") >= 0) {//跳转到接诊列表
      wx.navigateTo({
        url: '/pages/clinic/reception/receptionList/receptionList',
      })
    }
    if (titleString.indexOf("患者") >= 0) {//跳转到患者列表
      wx.navigateTo({
        url: '/pages/clinic/patient/patientList/patientList',
      })
    }
    if (titleString.indexOf("转诊") >= 0) {//跳转到转诊列表
      wx.showToast({
        title: '敬请期待',
      })
    }
  },

  onClickList(e){
    var titleString = e.currentTarget.dataset.item.title;
    if (titleString.indexOf("收费列表") >= 0){//跳转收费列表
        wx.navigateTo({
          url: '/pages/clinic/charge/chargeList/chargeList',
        })
    }
    if (titleString.indexOf("发药列表") >= 0){//跳转发药列表
        wx.navigateTo({
          url: '/pages/clinic/send/sendList/sendList',
        })
    }
  }
})