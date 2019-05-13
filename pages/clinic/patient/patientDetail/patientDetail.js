Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidePatientList: false,//是否隐藏患者列表
    isHideTreatList: true,//是否隐藏转诊患者
    isHideTransfer:true,//是否隐藏转诊列表
    currentIndex: 0,//当前切换的按钮
    //按钮颜色切换
    patientButtonColor: 'blue',
    patientBottomColor: "blue",
    treatButtonColor: 'black',
    treatBottomColor: "white",
    transferButtonColor:"black",
    transferBottomColor:"white",
    isBasic:true,
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
    wx.setNavigationBarTitle({
      title: '患者详情',
    })
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
   * 点击全部患者
   */
  clickPatientButton: function (event) {
    //1、设置按钮颜色
    this.data.patientButtonColor = 'blue';
    this.data.patientBottomColor = 'blue';
    this.data.treatButtonColor = 'black';
    this.data.treatBottomColor = 'white';
    this.data.transferButtonColor = 'black';
    this.data.transferBottomColor = 'white';
    //2、设置显示全部患者界面
    this.data.isHidePatientList = false;
    this.data.isHideTreatList = true;
    this.data.isHideTransfer = true;
    this.data.currentIndex = 0;
    //2.1、临时变量
    this.setData({
      isBasic : true
    });
    //3、刷新界面
    this.setData({
      patientButtonColor: this.data.patientButtonColor,
      patientBottomColor: this.data.patientBottomColor,
      treatButtonColor: this.data.treatButtonColor,
      treatBottomColor: this.data.treatBottomColor,
      transferButtonColor: this.data.transferButtonColor,
      transferBottomColor: this.data.transferBottomColor,
      isHidePatientList: this.data.isHidePatientList,
      isHideTreatList: this.data.isHideTreatList,
      isHideTransfer: this.data.isHideTransfer
    });
  },
  /**
   * 点击转诊患者
   */
  clickTreatButton: function (event) {
    //1、设置按钮颜色
    this.data.patientButtonColor = 'black';
    this.data.patientBottomColor = 'white';
    this.data.treatButtonColor = 'blue';
    this.data.treatBottomColor = 'blue';
    this.data.transferButtonColor = 'black';
    this.data.transferBottomColor = 'white';
    //2、设置显示转诊患者界面
    this.data.isHidePatientList = true;
    this.data.isHideTreatList = false;
    this.data.isHideTransfer = true;
    this.data.currentIndex = 1;
    //2.1、临时变量
    this.setData({
      isBasic: false
    });
    //3、刷新界面
    this.setData({
      patientButtonColor: this.data.patientButtonColor,
      patientBottomColor: this.data.patientBottomColor,
      treatButtonColor: this.data.treatButtonColor,
      treatBottomColor: this.data.treatBottomColor,
      transferButtonColor: this.data.transferButtonColor,
      transferBottomColor: this.data.transferBottomColor,
      isHidePatientList: this.data.isHidePatientList,
      isHideTreatList: this.data.isHideTreatList,
      isHideTransfer: this.data.isHideTransfer
    });
  },
  /**
   * 点击转诊患者按钮
   */
  clickTransferButton: function (event){
    //1、设置按钮颜色
    this.data.patientButtonColor = 'black';
    this.data.patientBottomColor = 'white';
    this.data.treatButtonColor = 'black';
    this.data.treatBottomColor = 'white';
    this.data.transferButtonColor = 'blue';
    this.data.transferBottomColor = 'blue';
    //2、设置显示转诊患者界面
    this.data.isHidePatientList = true;
    this.data.isHideTreatList = true;
    this.data.isHideTransfer = false;
    this.data.currentIndex = 2;
    //2.1、临时变量
    this.setData({
      isBasic: false
    });
    //3、刷新界面
    this.setData({
      patientButtonColor: this.data.patientButtonColor,
      patientBottomColor: this.data.patientBottomColor,
      treatButtonColor: this.data.treatButtonColor,
      treatBottomColor: this.data.treatBottomColor,
      transferButtonColor: this.data.transferButtonColor,
      transferBottomColor: this.data.transferBottomColor,
      isHidePatientList: this.data.isHidePatientList,
      isHideTreatList: this.data.isHideTreatList,
      isHideTransfer: this.data.isHideTransfer
    });
  }
})