//获取应用实例
const app = getApp()
//网络请求
var putinStockJs = require('../../../../api/drugRequest/drugRequest.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //仓库下标
    warehouseIndex: 0,
    //仓库列表
    warehouseArray:[],
    //供应商下标
    vendorIndex: 0,
    //供应商列表
    vendorArray:[],
    //入库时间
    inDate: '',
    //药品类型素组
    drugtypeArray: ['西药', '中成药', '中药', '医疗器械'],
    //药品数组
    dataSource:[],
    //总金额
    totalPrice: 0,
    //入库金额
    actualPrice: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1、初始化界面
    var that = this;
    that.setData({
      //当前界面是否显示仓库、供应商、入库时间
      isShowHeader: true,    
      //顶部栏高度
      headerHeight: 330,
      //扫码添加和手动添加距离顶部距离
      toolBarTop: 240    
    })
    //2、请求仓库列表
    putinStockJs.downloadWarehouseRequest(function (success) {
      //仓库数组赋值
      var rows = success.rows;
      that.data.warehouseArray = [];
      that.data.warehouseArray = that.data.warehouseArray.concat(rows);
      that.setData({
        warehouseArray: that.data.warehouseArray,
      })
    }, function(fail) {
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    });
    //3、供应商列表
    putinStockJs.downloadVendorRequest(function (success) {
      //供应商数组赋值
      var rows = success.rows;
      that.data.vendorArray = [];
      that.data.vendorArray = that.data.vendorArray.concat(rows);
      that.setData({
        vendorArray: that.data.vendorArray,
      })
    }, function (fail) {
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    });
    //4、入库时间赋值
    var util = require('../../../../utils/util.js');
    var today = util.formatDate(new Date());
    that.setData({
      inDate: today
    })
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
   * 选择仓库
   */
  bindWarehouseChange(e) {
    const val = e.detail.value
    this.setData({
      warehouseIndex: e.detail.value
    })
  },

  /**
   * 选择供应商
   */
  bindVendorChange(e) {
    const val = e.detail.value
    this.setData({
      vendorIndex: e.detail.value
    })
  },

  /**
   * 入库时间
   */
  bindInDateChange(e) {
    const val = e.detail.value;
    this.setData({
      inDate: e.detail.value
    })
  },

  /**
   * 点击手动添加
   */
  bindHandlePutinStock(e) {
    const val = e.detail.value
    //药品类型
    var drugtype = Number(e.detail.value) + 1;
    //image的url要特殊处理、否则json解析出错
    for (let i = 0; i < this.data.dataSource.length; i++) {
      var model = this.data.dataSource[i];
      model.image = encodeURIComponent(model.image);
    }
    //转换成json字符串
    var array = JSON.stringify(this.data.dataSource);
    //导航到药品列表
    wx.navigateTo({
      url: '/pages/drugStore/PutinStock/PutStockSelectDrug/putStockSelectDrug?id='
        + drugtype + '&drugArr=' + array,
    })
  },

  /**
   * 选择药品后回调
   */
  changeDataFromNextController(selectArr) {
    //1、数组处理
    this.data.dataSource = [];
    this.data.dataSource = this.data.dataSource.concat(selectArr);
    for(let i = 0; i < this.data.dataSource.length; i ++){
       var model = this.data.dataSource[i];
       console.log('=========');
       console.log(model);
    }
    //2、界面刷新
    this.setData({
      isShowHeader: false,//不显示顶部栏
      headerHeight: 90,//扫码添加和手动添加高度
      toolBarTop: 0,//只显示扫码添加、手动添加
      dataSource: this.data.dataSource//选中的数组
    })
  },

  /**
   * 扫码
   */
  ScanCodePutinStock: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        // 扫码成功
        var code = res.result;
        that.loadDrugDataByScanCode(code);
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        })
      },
      complete: (res) => {

      }
    })
  },

  /**
   * 扫码后请求药品数据
   */
  loadDrugDataByScanCode: function (code) {
    var that = this;
    putinStockJs.loadDrugDataByCode(code,
      function (success) {

        var drugModel = success;

        if (drugModel) {
          that.dataSource.push(drugModel);
          that.setData({
            isShowHeader: false,
            headerHeight: 90,
            toolBarTop: 0,
            drugsArray: that.dataSource
          })
        }
        else {
          //查询成功但是没有返回药品信息，接着查询药品是否存在基础库
          that.checkDrugWhetherInBasic(code);
        }
      }, function (fail) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      });
  },

  /**
   * 查询药品是否存在基础库
   */
  checkDrugWhetherInBasic: function (code) {

    putinStockJs.judgeDrugWhetherInBasic(code,
      function (success) {
        //返回结果
        var stateCode = success;
        if (stateCode == 202) {
          //药品存在基础库，可入库

        }
        else if (stateCode == 200) {
          //药品不在基础库里面，提示用户跳转初始化
          wx.showModal({
            title: '提示',
            content: '药品不存在基础库，请前往初始化',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
        else {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }

      }, function (fail) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      });
  },

  /**
   * 组件反向传值
   */
  clickDetailCell: function (e) {
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
    for (let i = 0; i < this.data.dataSource.length; i++) {
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
   * 点击底部入库按钮
   */
  clickBottomButton: function(){
    wx.showToast({
      title: '点击了底部按钮...',
    });
    //1、构造主表参数
    console.log(this.data.warehouseIndex);
    console.log(this.data.vendorIndex);

    console.log(this.data.warehouseArray);
    console.log(this.data.vendorArray);
    

    console.log(this.data.warehouseArray[this.data.warehouseIndex]);
    console.log(this.data.vendorArray[this.data.vendorIndex]);


    var listModel = {
      in_date: this.data.inDate,
      vendor: this.data.vendorArray[this.data.vendorIndex],
      warehouse: this.data.warehouseArray[this.data.warehouseIndex],
      price: this.data.totalPrice,
      cost: this.data.actualPrice,
    }
    putinStockJs.submitDrug(listModel, this.data.dataSource,
    function(success){

    },function(fail){

    });
  },

  /**
   * 点击底部历史入库按钮
   */
  clickHistoryButton: function(e){
    wx.navigateTo({
      url: '/pages/drugStore/PutinStock/storageList/storageList',
    })
  }
})