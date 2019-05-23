// pages/drugStore/InitDrug/addBatchList/addBatchList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listModel: '',//药品模型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('生命周期函数---options');
    console.log(options);
    //1、解析模型
    var listModel = JSON.parse(options.listModel);  
    this.data.listModel = listModel;
    //2、数据初始化
    this.initData();

    console.log(this.data.listModel);
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
   * 数据初始化
   */
  initData:function(e){
    console.log('数据初始化=-------');
    var tempArray = [];
    console.log(this.data.listModel);
    console.log(this.data.listModel.begin_json);
    if (this.data.listModel.begin_json.length == 0){
      //添加三组数据
      var dict = {
        expire_date:'',
        count:''
      }
      tempArray.push(dict);
      tempArray.push(dict);
      tempArray.push(dict);
    }
    //赋值
    this.data.listModel.begin_json = tempArray;
    //刷新界面
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 点击添加按钮
   */
  addBatch: function (e) {
    console.log('点击添加按钮-------');
    var dict = {
      expire_date: '',
      count: ''
    }
    this.data.listModel.begin_json.push(dict);
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 点击删除按钮
   */
  clickDeleteButton:function(e){
    console.log('点击删除按钮=======');
    console.log(e.currentTarget.dataset.index);
    //取值
    var index = e.currentTarget.dataset.index;
    //数组删除
    this.data.listModel.begin_json.splice(index,1);
    //刷新
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 点击失效日期
   */
  bindChooseExpireDate:function(e){
    console.log('点击失效日期-------');
    console.log(e.detail.value);
    //取值
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    //赋值
    var model = this.data.listModel.begin_json[index];
    model.expire_date = value;
    //刷新
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 库存输入
   */
  localCountInput:function(e){
    console.log('库存输入====');
    //取值
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    //赋值
    var model = this.data.listModel.begin_json[index];
    model.count = value;
    //刷新
    this.setData({
      listModel: this.data.listModel
    });
  },

  /**
   * 点击保存按钮
   */
  clickSureButton:function(e){
    console.log('点击保存按钮------');
    //参数校验
    if (!this.checkParam()){
      return;
    }
    //1、将模型转换为json
    var modelJson = JSON.stringify(this.data.listModel.begin_json);
    //2、传递回去
    //获取所有界面
    var pages = getCurrentPages();
    //当前页面
    var currPage = pages[pages.length - 1];
    //上一个页面
    var prevPage = pages[pages.length - 2];
    //调用上一个界面方法
    prevPage.batchListBackData(modelJson);
    //3、返回上一个界面
    wx.navigateBack({
    });
  },

  /**
   * 参数校验
   */
  checkParam:function(){
    console.log('参数校验-------------');
    var isLegal = true;
    //1、提示批次不能为空
    if(this.data.listModel.begin_json.length == 0){
      wx.showToast({
        title: '批次不能为空',
      })
      isLegal = false;
      return isLegal;
    }
    //2、提示某一组的某一项不能为空
    var tip = '';
    for (let i = 0; i < this.data.listModel.begin_json.length; i++) {
      var model = this.data.listModel.begin_json[i];
      var index = i + 1;
      //检测有效期
      if (!model.expire_date) {
        tip = '请先填写第' + index + '批药品的失效日期';
        isLegal = false;
        break;
      }
      //检测数量
      if ((!model.count) || (model.count == 0)) {
        tip = '请先填写第' + index + '批药品的期初库存';
        isLegal = false;
        break;
      }
    }
    //判断是否合法
    if (!isLegal) {
      wx.showModal({
        title: '提示',
        content: tip,
        showCancel: false,
        confirmText: '确定'
      });
    }
    return isLegal;  
  }

})