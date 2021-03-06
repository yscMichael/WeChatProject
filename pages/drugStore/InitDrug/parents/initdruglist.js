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
    //西药数量
    westCount:0,
    //中成药数量
    specialCount:0,
    //中药数量
    chineseCount:0,
    //医疗器械数量
    instrumentCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var screenWidth = wx.getSystemInfoSync().windowWidth;
    var screenHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      screenWidth: screenWidth,
      screenHeight: (screenHeight - 100)
    });
    this.refreshData();
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
   * 刷新所有数据
   */
  refreshData:function(){
    console.log('刷新所有数据');
    this.selectComponent("#westDrugList").westRefresh();
    this.selectComponent("#specialChineseDrugList").specialChineseRefresh();
    this.selectComponent("#chineseDrugList").chineseRefresh();
    this.selectComponent("#instrumentList").instrumentRefresh();
    //设置初始数值
    this.setData({
      totalcount: this.data.westCount
    });
  },

  /**
   * 切换栏点击事件
   */
  switchSliderToolBarItem: function(e) {
    this.data.selectIndex = e.currentTarget.dataset.idx;
    this.setData({
      selectIndex: this.data.selectIndex
    });
    //更新底部数据
    this.changeBottomCount(this.data.selectIndex);
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
    //更新底部数据
    this.changeBottomCount(this.data.selectIndex);
  },

  /**
   * 更新底部数据
   */
  changeBottomCount: function (selectIndex){
    console.log('更新底部数据');
    if (selectIndex == 0){//西药
      this.setData({
        totalcount:this.data.westCount
      });
    }else if(selectIndex == 1){//中成药
      this.setData({
        totalcount: this.data.specialCount
      });
    }else if(selectIndex == 2){//中药
      this.setData({
        totalcount: this.data.chineseCount
      });
    }else if(selectIndex == 3){//医疗器械
      this.setData({
        totalcount: this.data.instrumentCount
      });
    }else{//西药
      this.setData({
        totalcount: this.data.westCount
      });
    }
  },

  /**
   * 点击西药cell
   */
  onClickWestCell:function(e){
    console.log('点击西药cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);
    //判断drugType是否为0、为0的话就刷新底部数据
    if (e.detail.drugType == 0){//当前传递的是数量
      this.data.westCount = e.detail.count;
      this.changeBottomCount(this.data.selectIndex);
    }else{
      //这里要对image进行特殊编码(防止出现特殊字符)
      var listModel = e.detail.listModel;
      if (listModel.image != '/image/img_ypmr.png') {//编码
        listModel.image = encodeURIComponent(listModel.image);
      }
      var listModelString = JSON.stringify(e.detail.listModel);
      //进入药品初始化详情
      wx.navigateTo({
        url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString + '&isEdit=1',
      });
    }
  },

  /**
   * 点击中成药cell
   */
  onClickSpecialChineseCell:function(e){
    console.log('点击中成药cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);
    //判断drugType是否为0、为0的话就刷新底部数据
    if (e.detail.drugType == 0) {//当前传递的是数量
      this.data.specialCount = e.detail.count;
      this.changeBottomCount(this.data.selectIndex);
    }else{
      //这里要对image进行特殊编码(防止出现特殊字符)
      var listModel = e.detail.listModel;
      if (listModel.image != '/image/img_ypmr.png') {//编码
        listModel.image = encodeURIComponent(listModel.image);
      }
      var listModelString = JSON.stringify(e.detail.listModel);
      wx.navigateTo({
        url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString + '&isEdit=1',
      });
    }
  },

  /**
   * 点击中药cell
   */
  onClickChineseCell:function(e){
    console.log('点击中药cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);
    //判断drugType是否为0、为0的话就刷新底部数据
    if (e.detail.drugType == 0) {//当前传递的是数量
      this.data.chineseCount = e.detail.count;
      this.changeBottomCount(this.data.selectIndex);
    }else{
      //这里要对image进行特殊编码(防止出现特殊字符)
      var listModel = e.detail.listModel;
      if (listModel.image != '/image/img_ypmr.png') {//编码
        listModel.image = encodeURIComponent(listModel.image);
      }
      var listModelString = JSON.stringify(e.detail.listModel);
      wx.navigateTo({
        url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString + '&isEdit=1',
      });
    }
  },

  /**
   * 点击医疗器械cell
   */
  onClickInstrumentCell:function(e){
    console.log('点击医疗器械cell---main');
    console.log(e.detail.drugType);
    console.log(e.detail.listModel);
    //判断drugType是否为0、为0的话就刷新底部数据
    if (e.detail.drugType == 0) {//当前传递的是数量
      this.data.instrumentCount = e.detail.count;
      this.changeBottomCount(this.data.selectIndex);
    }else{
      //这里要对image进行特殊编码(防止出现特殊字符)
      var listModel = e.detail.listModel;
      if (listModel.image != '/image/img_ypmr.png') {//编码
        listModel.image = encodeURIComponent(listModel.image);
      }
      var listModelString = JSON.stringify(e.detail.listModel);
      wx.navigateTo({
        url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?drugType=" + e.detail.drugType + '&listModel=' + listModelString + '&isEdit=1',
      });
    }
  },

  /**
   * 选择添加药品方式
   */
  bindSelectInitDrugType(e) {
    const val = e.detail.value;
    var index = Number(e.detail.value);
    switch (index) {
      case 0:
        console.log('扫码添加');
        this.addDrugByScan();
        break;
      case 1:
        console.log('搜索添加');
        var drugType = this.data.selectIndex + 1;
        wx.navigateTo({
          url: '/pages/drugStore/InitDrug/searchAndAddDrugList/searchAndAddDrugList?drugType=' + drugType,
        });
        break;
      case 2:
        console.log('自定义添加');
        var listModel = this.initListModel();
        var listModelString = JSON.stringify(listModel);
        wx.navigateTo({
          url: '/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?listModel=' + listModelString + '&isEdit=0',
        });
        break;
    }
  },

  /**
   * 扫码添加药品
   */
  addDrugByScan:function(){
    //1、开始扫码
    var that = this;
    wx.scanCode({
      success(res){
        //扫码成功
        var code = res.result;
        console.log('扫码成功');
        console.log(code);
        //1、根据code码查询药品是否已经初始化过
        that.checkMedicineisInit(code);
      },
      fail(res){
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }});
  },

  /**
   * 0.根据条形码查询药品是否已经初始化过
   */
  checkMedicineisInit:function(code){
    var that = this;
    initDrugJs.loadDrugInfoFirstByCode(code,
    function(success){
      if (success == 202) {//已经初始化过、接着根据code查询药品信息
        that.loadDrugInformation(code);
      } else if (success == 200) {//未初始化过、接着查询基础库里面有没有
        that.checkDrugInBase(code);
      }else{//暂时不处理
        wx.showToast({
          title: '查询失败',
        })
      }
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      })
    });
  }, 

  /**
   * 1.1、根据条形码获取药品信息
   */
  loadDrugInformation:function(code){
    var that = this;
    initDrugJs.getDrugWithKeyWord(code,
    function(success){
      //1、判断success内容
      var tips = '该药品已禁用，如需启用，请在电脑端-基础设置菜单修改';
      if(success == tips){//禁用
        that.sendTipForbidden();
      }else{//提示药品已经初始化
        wx.showModal({
          title: '提示',
          content: '该药品已初始化，是否修改？',
          success(res) {
            if (res.confirm) {//点击确定、进入下一界面
              that.goToEditDetailByScan(success);
            } else if (res.cancel) {//点击取消、继续扫描
              that.addDrugByScan();
            }
          }
        });
      }
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      })
    });
  },

  /**
   * 1.1.1、给出禁用提示
   */
  sendTipForbidden:function(){
    wx.showModal({
      title: '提示',
      content: '该药品已禁用，如需启用，请在电脑端-基础设置菜单修改',
      showCancel: false,
      confirmText: '确定'
    });
  },

  /**
   * 1.1.2、初始化过药品进入编辑界面(扫码)
   */
  goToEditDetailByScan: function (listModel){
    //这里要对image进行特殊编码(防止出现特殊字符)
    if (listModel.image != '/image/img_ypmr.png') {//编码
      listModel.image = encodeURIComponent(listModel.image);
    }
    var listModelString = JSON.stringify(listModel);
    //进入药品初始化详情
    wx.navigateTo({
      url: "/pages/drugStore/InitDrug/initDrugDetail/initDrugDetail?listModel=" + listModelString + '&isEdit=1',
    });
  },

  /**
   * 2.1、根据code查询药品是否在基础库
   */ 
  checkDrugInBase: function (code){
    console.log('2.1、根据code查询药品是否在基础库');
    var that = this;
    initDrugJs.checkDrugisFromBasicStorage(code,
    function(success){
      var tips = '基础库中没有';
      if (success == tips) {//基础库里面没有、直接查询第三方接口
        that.loadDrugFromNetAPI(code);
      }else{//基础库里面有、进入详情界面、不可编辑
        that.goToNoEditDetailByScan(success);
      }
    },function(fail){
      wx.showToast({
        title: '网络加载失败',
      })
    });
  },

  /**
   * 2.2、从第三方接口查询药品信息
   */
  loadDrugFromNetAPI:function(code){
    var that = this;
    wx.showLoading({
      title: '第三方数据加载中',
    });
    initDrugJs.loadDrugInformationFromNetAPI(code,
    function(success){
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
      //进入不可编辑界面
      that.goToNoEditDetailByScan(tempModel);
    },function(fail){
      wx.hideLoading();
      wx.showToast({
        title: '未查到任何信息',
      });
    });
  },

  /**
   * 2.3、进入非编辑界面(扫码)
   */
  goToNoEditDetailByScan: function (listModel) {
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
   * 初始化模型(自定义添加)
   */
  initListModel:function(){
    var listModel = initDrugJs.createListModel();
    //1、确定当前药品类型
    var drugType = {
      id:1,
      key_name:''
    };
    drugType.id = this.data.selectIndex + 1;
    drugType.key_name = this.data.titlesArr[this.data.selectIndex];
    listModel.dug_type = drugType;
    //2、is_basic
    var is_basic = {
      id: 0,
      key_name: ''
    };
    listModel.is_basic = is_basic;
    console.log('初始化模型----------');
    console.log(listModel);
    return listModel;
  },

})