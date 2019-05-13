// pages/clinic/patient/addEditPatient/addEditPatient.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 姓名
     */
    name:'',
    /**
     * 性别
     */
    gender: '1',//默认是男(男:1 女:2) 
    /**
     * 是否是孕妇
     */
    pregnant:'1',//默认是(是:1 否:0)
    /**
     * 年
     */
    age: '0',//默认值0
    /**
     * 月
     */
    month: '0',//默认0
    /**
     * 天
     */
    day: '0',//默认0
    /**
     * 联系方式
     */
    mobile: '',
    /**
     * 过敏史
     */
    allergic: '',
    /**
     * 过敏史数组
     */
    allergicArray:[],
    /**
     * 陪护人姓名
     */
    caregiverName: '',
    /**
     * 陪护人联系方式
     */
    caregiverMobile: '',
    /**
     * 与患者关系
     */
    relationship: '1',//默认父子(父子:1 母子:2 其它:3)
    /**
     * 血型
     */
    bloodType:'1',//默认A型(A型:1,B型:2,AB型:3,O型:4)
    /**
     * 所在地区
     */
    region:'',
    /**
     * 省id
     */
    provinceId:'',
    /**
     * 市id
     */
    cityId:'',
    /**
     * 区id
     */
    districtId:'',
    /**
     * 详细地址
     */
    address:'',
    /**
     * 备注
     */
    remark:''
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

  }
})