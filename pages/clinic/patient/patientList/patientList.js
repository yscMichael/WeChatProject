//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',//搜索关键字
    isHidePatientList: false,//是否隐藏患者列表
    isHideTreatList:true,//是否隐藏转诊患者
    currentIndex:0,//当前切换的按钮
    //按钮颜色切换
    patientButtonColor:'blue',
    treatButtonColor:'black',
    patientBottomColor:"blue",
    treatBottomColor:"white"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent("#allPatient").beginRefresh();
    this.selectComponent("#treatPatient").treatRefresh();
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
    if(this.data.currentIndex === 0){//全部患者列表
      this.selectComponent("#allPatient").beginRefresh();
    }else{
      this.selectComponent("#treatPatient").treatRefresh();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1、根据按钮、判断调用方法
    if (this.data.currentIndex === 0) {//全部患者列表
      this.selectComponent("#allPatient").beginLoadMore();
    } else {
      this.selectComponent("#treatPatient").treatLoadMore();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击全部患者
   */
  clickPatientButton:function(event){
    //1、设置按钮颜色
    this.data.patientButtonColor = 'blue';
    this.data.patientBottomColor = 'blue';
    this.data.treatButtonColor = 'black';
    this.data.treatBottomColor = 'white';
    //2、设置显示全部患者界面
    this.data.isHidePatientList = false;
    this.data.isHideTreatList = true;
    this.data.currentIndex = 0;
    //3、刷新界面
    this.setData({
      patientButtonColor: this.data.patientButtonColor,
      patientBottomColor: this.data.patientBottomColor,
      treatButtonColor: this.data.treatButtonColor,
      treatBottomColor: this.data.treatBottomColor,
      isHidePatientList: this.data.isHidePatientList,
      isHideTreatList: this.data.isHideTreatList
    });
  },
  /**
   * 点击转诊患者
   */
  clickTreatButton:function(event){
    //1、设置按钮颜色
    this.data.patientButtonColor = 'black';
    this.data.patientBottomColor = 'white';
    this.data.treatButtonColor = 'blue';
    this.data.treatBottomColor = 'blue';
    //2、设置显示转诊患者界面
    this.data.isHidePatientList = true;
    this.data.isHideTreatList = false;
    this.data.currentIndex = 1;
    //3、刷新界面
    this.setData({
      patientButtonColor: this.data.patientButtonColor,
      patientBottomColor: this.data.patientBottomColor,
      treatButtonColor: this.data.treatButtonColor,
      treatBottomColor: this.data.treatBottomColor,
      isHidePatientList: this.data.isHidePatientList,
      isHideTreatList: this.data.isHideTreatList
    });
  },
  /**
   * 网络请求完成
   */
  _netWorkSuccess:function(){
    wx.stopPullDownRefresh();
  },
  /**
   * 添加患者
   */
  clickAddNewPatient: function(){
    wx.showToast({
      title: '添加患者',
    });
    wx.navigateTo({
      url: '/pages/clinic/patient/addEditPatient/addEditPatient',
    })
  },
  /**
   * 点击全部患者列表
   */
  onClickAllPatient:function(){
    wx.navigateTo({
      url: '/pages/clinic/patient/patientDetail/patientDetail',
    })
  }
})
