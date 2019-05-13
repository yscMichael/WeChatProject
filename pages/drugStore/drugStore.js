Page({

  /**
   * 页面的初始数据
   */
  data: {
    //防止多次点击响应
    buttonClicked:false,
  },
  /**
   * 点击进入次级界面（采购入库、库存查询、库存盘点、药品初始化）
   */
  JumpToPintostock: function (event) {
    var jumpid = event.currentTarget.dataset.jumpid;
    if (!this.buttonClicked) {
      this.buttonClicked = !0;
      var url = '';
      if (jumpid === 'WWDrugPutinStock'){//采购入库界面
        url = '/pages/drugStore/PutinStock/main/WWDrugPutinStock';
        wx.navigateTo({
          url: url
        });
      }
      else if (jumpid === 'WWDrugInitDrug'){//药品初始化界面
        url = '/pages/drugStore/InitDrug/parents/initdruglist';
        wx.navigateTo({
          url: url
        });
      }
      else{//库存查询和库存盘点
        wx.showToast({
          title: '正在开发中...',
        });
        this.buttonClicked = !1;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this
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
    this.buttonClicked = !1;
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
    
  }
})