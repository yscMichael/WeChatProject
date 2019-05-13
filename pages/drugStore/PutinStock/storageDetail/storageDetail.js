//获取应用实例
const app = getApp();
//网络请求
var storageJs = require('../../../../api/drugRequest/drugRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],//经过处理的数据
    in_date: '',//入库时间
    handle_entity: '',//入库人
    warehouse: '',//仓库
    vendor: '',//供应商
    isStoraging:false,//是否是待审核
    batchId:'',//id
    totalPrice:0,//总金额
    actualPrice:0,//入库金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1、处理头部信息
    //id
    this.data.batchId = options.id;
    //isStoraging
    this.data.isStoraging = options.isStoraging == 'true' ? true : false;
    //listModel
    var listModel = JSON.parse(options.listModel);
    this.data.in_date = listModel.in_date;
    this.data.handle_entity = listModel.handle_entity;
    this.data.warehouse = listModel.warehouse;
    this.data.vendor = listModel.vendor;
    this.data.totalPrice = listModel.totalPrice;
    this.data.actualPrice = listModel.actualPrice;
    //界面刷新
    this.setData({
      isStoraging: this.data.isStoraging,
      in_date: this.data.in_date,
      handle_entity: this.data.handle_entity,
      warehouse: this.data.warehouse,
      vendor: this.data.vendor,
      totalPrice: this.data.totalPrice,
      actualPrice: this.data.actualPrice
    });
    //2、网络请求药品信息
    this.getDrugData();
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
   * 获取药品详情列表
   */
  getDrugData:function(){
    var that = this;
    storageJs.getPwBillDetail(this.data.batchId,function(success){
      //填充数据
      that.data.dataSource = that.data.dataSource.concat(success);
      //刷新界面
      that.setData({
        dataSource: that.data.dataSource
      });
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      })
    });
  },
  /**
   * 组件反向传值
   */
  clickDetailCell:function(e){    
    //1、当前绑定的值item
    var currentItem = e.currentTarget.dataset.item;
    //2、当前数据源的值(根据index)
    var index = e.currentTarget.dataset.index;
    var model = this.data.dataSource[index];
    //3、反向传过来的值
    var detailDict = e.detail;

    //4、将反向值赋值给绑定值
    //失效日期
    currentItem.expire_date = detailDict.expire_date;
    //批号
    currentItem.batch_no = detailDict.batch_no;
    //进货单价
    currentItem.price = Number(detailDict.price);
    //进货数量
    currentItem.count = Number(detailDict.count);
    //小计
    currentItem.cost = Number(detailDict.cost);

    //5、将反向值赋值给数据源值
    //失效日期
    model.expire_date = detailDict.expire_date;
    //批号
    model.batch_no = detailDict.batch_no;
    //进货单价
    model.price = Number(detailDict.price);
    //进货数量
    model.count = Number(detailDict.count);
    //小计
    model.cost = Number(detailDict.cost);

    //6、计算底部总金额
    var totalPrice = 0;
    for(let i=0; i<this.data.dataSource.length; i++){
      var model = this.data.dataSource[i];
      //单价
      var price = model.price;
      //数量
      var count = model.count;
      //小计
      var cost = price * count;
      totalPrice += cost;
    }
    //7、刷新底部金额
    this.data.totalPrice = totalPrice;
    this.data.actualPrice = (this.data.actualPrice < this.data.totalPrice) ? totalPrice : this.data.actualPrice;
    this.setData({
      totalPrice: this.data.totalPrice,
      actualPrice: this.data.actualPrice
    });
  },
  
  /**
   * 点击审核通过按钮
   */
  clickPassButton:function(e){
    //1、构造主表参数
    var listModel = {
      batchId: this.data.batchId,
      in_date: this.data.in_date,
      vendor: this.data.vendor,
      warehouse: this.data.warehouse,
      price: this.data.totalPrice,
      cost: this.data.actualPrice,
    }
    //2、发起网络请求
    wx.showLoading({
      title: '',
    });
    storageJs.postDrugData(listModel, this.data.dataSource,
    function(success){
      //1、提示
      wx.hideLoading();
      wx.showToast({
        title: '审核通过',
      });
      //2、通知待审核界面刷新
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];//当前页面
      var prevPage = pages[pages.length - 2];//上一个页面
      prevPage.refreshAllData();
      //3、延时返回
      setTimeout(function () {
        wx.navigateBack({
        });
      }, 500);
    },function(fail){
      wx.hideLoading();
      wx.showToast({
        title: '网络加载失败',
      })
    });
  }
})