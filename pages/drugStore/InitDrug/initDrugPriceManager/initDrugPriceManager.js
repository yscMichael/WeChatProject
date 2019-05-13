
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listModel:'',//模型数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1、解析模型
    var listModel = JSON.parse(options.listModel);
    //2、刷新界面
    this.data.listModel = listModel;
    this.setData({
      listModel: this.data.listModel
    });
    console.log('价格管理---------');
    console.log(listModel);
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
   * 进货价输入
   */
  costInput:function(e){
    console.log('进货价输入---------');
    console.log(e);
    this.data.listModel.cost = e.detail.value;
  },

  /**
   * 处方价(包装单位)
   */
  minPriceInput:function(e){
    this.data.listModel.min_price = e.detail.value;
  },

  /**
   * 处方价(拆零单位)
   */
  salePriceInput:function(e){
    this.data.listModel.sale_price = e.detail.value;
  },

  /**
   * 零售价(包装单位)
   */
  retailMinPriceInput:function(e){
    this.data.listModel.retail_min_price = e.detail.value;
  },

  /**
   * 零售价(拆零单位)
   */
  retailSalePriceInput:function(e){
    this.data.listModel.retail_sale_price = e.detail.value;
  },

  /**
   * 点击保存按钮
   */
  clickSureButton:function(e){
    //获取所有界面
    var pages = getCurrentPages();
    //当前页面
    var currPage = pages[pages.length - 1];
    //上一个页面
    var prevPage = pages[pages.length - 2];
    //调用上一个界面方法
    prevPage.priceManageBackData(this.data.listModel.cost, 'cost');
    prevPage.priceManageBackData(this.data.listModel.min_price, 'min_price');
    prevPage.priceManageBackData(this.data.listModel.sale_price, 'sale_price');
    prevPage.priceManageBackData(this.data.listModel.retail_min_price, 'retail_min_price');
    prevPage.priceManageBackData(this.data.listModel.retail_sale_price, 'retail_sale_price');
  },
})