//获取应用实例
const app = getApp()
//网络请求
var putinStockJs = require('../../../../api/drugRequest/drugRequest.js');
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');

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
    actualPrice: 0,
    //条形码
    saveCode:'',
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
      that.data.warehouseArray = [];
      that.data.warehouseArray = that.data.warehouseArray.concat(success);
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
      that.data.vendorArray = [];
      that.data.vendorArray = that.data.vendorArray.concat(success);
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
    if (!this.checkRight){//增加权限判断
       return; 
    }
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
   * 检查权限、供应商、仓库、入库时间
   */
  checkRight:function(){
    console.log('检查权限--------');
    var resultJudge = true;
    //1、判断权限
    if (!app.globalData.local_add){
        wx.showToast({
          title: '您不能进行入库操作',
        });
        resultJudge = false;
    }
    //2、选择仓库
    if (this.data.warehouseArray.length == 0){
      wx.showToast({
        title: '请选择仓库',
      });
      resultJudge = false;
    }
    //3、供应商
    if (this.data.vendorArray.length == 0) {
      wx.showToast({
        title: '请选择供应商',
      });
      resultJudge = false;
    }
    return resultJudge;
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
   * 扫码添加
   */
  ScanCodePutinStock: function () {
    if (!this.checkRight) {//增加权限判断
      return;
    }
    //1、开始扫码
    var that = this;
    wx.scanCode({
      success(res) {
        //扫码成功
        var code = res.result;
        console.log('扫码成功');
        console.log(code);
        that.data.saveCode = code;
        that.loadDrugDataByScanCode(code);
      },
      fail(res) {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 0.根据code码查询药品信息
   */
  loadDrugDataByScanCode: function (code) {
    var that = this;
    putinStockJs.loadDrugDataByCode(code,
      function (success) {
        //1、将药品添加到数组中
        that.data.dataSource.push(success);
        //2、刷新界面
        that.setData({
          isShowHeader: false,
          headerHeight: 90,
          toolBarTop: 0,
          dataSource:that.data.dataSource
        });
      }, function (fail) {
        if (fail == '检查初始化'){
          //检查是否初始化
          that.checkDrugisInit(code);
        }else{
          wx.showToast({
            title: fail,
            icon: 'none'
          })
        }
      });
  },

  /**
   * 1、检查药品是否初始化
   */
  checkDrugisInit:function(code){
    var that = this;
    putinStockJs.checkIsInit(code,function(success){
      if(success == 202){//药品禁用
        wx.showModal({
          title: '提示',
          content: '该药品已禁用，如需启用，请在电脑端-基础设置菜单修改',
          showCancel: false,
          confirmText: '确定'
        });
      }else{//不在基础库、需要初始化
        wx.showModal({
          title: '提示',
          content: '该药品在基础库中不存在，是否进行药品初始化？',
          success(res) {
            if (res.confirm) {//点击确定、调用3023接口查询药品信息
              that.loadDrugFromNetAPI(code);
            }
          }
        });
      }
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      });
    });
  },

  /**
   * 2、调用3023查询第三方药品信息
   */
  loadDrugFromNetAPI:function(code){
    var that = this;
    wx.showLoading({
      title: '第三方数据加载中',
    });
    initDrugJs.loadDrugInformationFromNetAPI(code,
      function (success) {
        wx.hideLoading();
        //1、先初始化一个模型
        var tempModel = that.initListModel();
        //2、根据扫码信息进一步初始化、然后进入isEdit=NO界面
        //条形码
        tempModel.uuid = code;
        //通用名
        tempModel.common_name = success.name ? success.name : '';
        //商品名
        tempModel.key_name = success.name ? success.name : '';
        //生产厂商
        tempModel.manufacturer_name = success.company ? success.company : '';
        //规格
        tempModel.spec = success.spec ? success.spec : '';
        //弹出类型选择界面
        that.popDrugTypeChoose(tempModel);
      }, function (fail) {
        wx.hideLoading();
        wx.showToast({
          title: '未查到任何信息',
        });
      });
  },

  /**
   * 3、弹出类型选择界面
   */
  popDrugTypeChoose: function (tempModel){
    var that = this;
    var tempList = ['西药', '中成药', '中药', '医疗器械'];
    wx.showActionSheet({
      itemList: ['西药', '中成药', '中药', '医疗器械'],
      success(e) {
        console.log(e.tapIndex)
        //对模型药品类型赋值
        var dug_type = {
          id:'',
          key_name:''
        };
        dug_type.id = e.tapIndex + 1;
        dug_type.key_name = tempList[e.tapIndex];
        tempModel.dug_type = dug_type;
        //进入初始化详情界面
        that.goToDrugDetail(tempModel);
      }
    })
  },

  /**
   * 4、进入药品初始化非编辑界面
   */
  goToDrugDetail: function (listModel) {
    //这里要对image进行特殊编码(防止出现特殊字符)
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(listModel);
    //进入药品初始化详情
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?listModel=" + listModelString + '&isEdit=0',
    });
  },

  /**
   * 5、药品初始化完成反向通知
   * 这里重新调用上面接口即可
   */
  completeInitDrug:function(){
    console.log('药品初始化完成');
    this.loadDrugDataByScanCode(this.data.saveCode);
  },

  /**
   * 初始化模型(自定义添加)
   */
  initListModel: function () {
    var listModel = initDrugJs.createListModel();
    //1、is_basic
    var is_basic = {
      id: 0,
      key_name: ''
    };
    listModel.is_basic = is_basic;
    console.log('初始化模型----------');
    console.log(listModel);
    return listModel;
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
    //进货单价(药品这里是cost、与实际相反)
    currentItem.cost = Number(detailDict.price);
    //进货数量
    currentItem.count = Number(detailDict.count);
    //小计(药品这里是price、与实际相反)
    currentItem.price = Number(detailDict.cost);

    //5、将反向值赋值给数据源值
    //失效日期
    model.expire_date = detailDict.expire_date;
    //批号
    model.batch_no = detailDict.batch_no;
    //进货单价(药品这里是cost、与实际相反)
    model.cost = Number(detailDict.price);
    //进货数量
    model.count = Number(detailDict.count);
    //小计(药品这里是price、与实际相反)
    model.price = Number(detailDict.cost);

    //6、计算底部总金额
    var totalPrice = 0;
    for (let i = 0; i < this.data.dataSource.length; i++) {
      var model = this.data.dataSource[i];
      //单价
      var cost = model.cost;
      //数量
      var count = model.count;
      //小计
      var total = cost * count;
      totalPrice += total;
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
    console.log('点击底部入库按钮----top');
    //1、校验参数
    if(!this.checkParam()){
      return;
    }
    //2、构造主表参数
    var that = this;
    var listModel = {
      in_date: this.data.inDate,
      vendor: this.data.vendorArray[this.data.vendorIndex],
      warehouse: this.data.warehouseArray[this.data.warehouseIndex],
      price: this.data.totalPrice,
      cost: this.data.actualPrice,
    }
    wx.showLoading({
      title: '正在入库...',
    });
    putinStockJs.submitDrug(listModel, this.data.dataSource,
    function(success){
      wx.hideLoading();
      //1、提示
      wx.showToast({
        title: '入库成功',
      });
      //2、清空当前数据源
      that.data.dataSource = [];
      that.setData({
        dataSource: that.data.dataSource,
        isShowHeader:true,
        headerHeight:330,
        toolBarTop:240
      });
      //3、进入入库列表界面
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/drugStore/PutinStock/storageList/storageList',
        });
      },1000);
    },function(fail){
        wx.hideLoading();
        wx.showToast({
          title: fail,
        });
    });
  },

  /**
   * 点击直接入库、进行参数校验
   */
  checkParam:function(){
    var isLegal = true;
    var tip = '';
    for (let i = 0; i < this.data.dataSource.length; i ++){
      var model = this.data.dataSource[i];
      var index = i + 1;
      //检测有效期
      if (!model.expire_date){
        tip = '请先填写第' + index + '个药品的失效日期';
        isLegal = false;
        break;
      }
      //检测数量
      if ((!model.count) || (model.count == 0)){
        tip = '请先填写第' + index + '个药品的数量';
        isLegal = false;
        break;
      }
    }
    //判断是否合法
    if (!isLegal){
      wx.showModal({
        title: '提示',
        content: tip,
        showCancel: false,
        confirmText: '确定'
      });
    }
    return isLegal;
  },

  /**
   * 点击底部历史入库按钮
   */
  clickHistoryButton: function(e){
    wx.navigateTo({
      url: '/pages/drugStore/PutinStock/storageList/storageList',
    })
  },

  /**
   * 点击删除按钮
   */
  clickDeleteImage:function(e){
    console.log('点击删除按钮--------');
    console.log(e);
    //1、删除元素、更新数据源
    var index = e.currentTarget.dataset.index;
    this.data.dataSource.splice(index,1);
    this.setData({
      dataSource: this.data.dataSource
    });
    //2、防止数组为空
    if(this.data.dataSource.length == 0){
      this.setData({
        isShowHeader: true,
        headerHeight: 330,
        toolBarTop: 240
      });
    }else{
      //3、计算底部总金额
      var totalPrice = 0;
      for (let i = 0; i < this.data.dataSource.length; i++) {
        var model = this.data.dataSource[i];
        //单价
        var cost = model.cost;
        //数量
        var count = model.count;
        //小计
        var total = cost * count;
        totalPrice += total;
      }
      //7、刷新底部金额
      this.data.totalPrice = totalPrice;
      this.data.actualPrice = (this.data.actualPrice < this.data.totalPrice) ? totalPrice : this.data.actualPrice;
      this.setData({
        totalPrice: this.data.totalPrice,
        actualPrice: this.data.actualPrice
      });
    }
  }
})