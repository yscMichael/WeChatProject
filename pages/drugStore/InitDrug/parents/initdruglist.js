//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // item数组
    titlesArr: ['西药', '中成药', '中药', '医疗器械'],
    // 当前选中下标
    selectIndex: 0,
    // 初始化药品方式
    initDrugTypeArr:['扫码添加', '搜索添加', '自定义添加'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent("#westDrugList").westRefresh();
    this.selectComponent("#specialChineseDrugList").specialChineseRefresh();
    this.selectComponent("#chineseDrugList").chineseRefresh();
    this.selectComponent("#instrumentList").instrumentRefresh();
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
   * 切换栏点击事件
   */
  switchSliderToolBarItem: function(e) {
    this.data.selectIndex = e.currentTarget.dataset.idx;
    this.setData({
      selectIndex: this.data.selectIndex
    })
  },

  /**
   * 横向滚动事件
   */
  bindScrollViewChange: function (e) {
    var count = e.detail.current;
    this.data.selectIndex = count;
    this.setData({
      selectIndex: this.data.selectIndex
    });
  },

  /**
   * 点击西药cell
   */
  onClickWestCell:function(e){
    console.log('点击西药cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);
    
    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = e.detail.listModel;
    if (listModel.image != '/image/img_ypmr.png'){//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(e.detail.listModel);
    //进入药品初始化详情
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString,
    });
  },

  /**
   * 点击中成药cell
   */
  onClickSpecialChineseCell:function(e){
    console.log('点击中成药cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);

    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = e.detail.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(e.detail.listModel);
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString,
    });
  },

  /**
   * 点击中药cell
   */
  onClickChineseCell:function(e){
    console.log('点击中药cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);

    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = e.detail.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(e.detail.listModel);
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString,
    });
  },

  /**
   * 点击医疗器械cell
   */
  onClickInstrumentCell:function(e){
    console.log('点击医疗器械cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);

    //这里要对image进行特殊编码(防止出现特殊字符)
    var listModel = e.detail.listModel;
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(e.detail.listModel);
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString,
    });
  },

  /**
   * 选择添加药品方式
   */
  bindSelectInitDrugType(e) {
    const val = e.detail.value;
    var index = Number(e.detail.value);
    switch (index) {
      case 0:
        console.log('扫码')
        break;
      case 1:
        console.log('手动')
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail',
        })
        break;
    }
  }
})