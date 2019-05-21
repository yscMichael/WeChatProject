//获取应用实例
const app = getApp()
//网络请求
var initDrugJs = require('../../../../api/initDrugRequest/initDrugRequest.js');
var drugJs = require('../../../../api/drugRequest/drugRequest.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 宽度
     */
    selfWidth: {
      type: String,
      value: ''
    },
    /**
     * 高度
     */
    selfHeight: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    //动画
    animationData: {},
    //数据源
    itemDataSource:[],
    //true:隐藏 false:显示
    hideModal:true,
    //列表类型(1:剂型列表、2:处方单位、3:拆零单位、4:服用单位、5:供应商)
    listType:'',
    //标题
    title:'',
    //副标题
    subTitle:'',
    //当前选中的item
    currentIndex:0,
    //当前输入的单位内容
    addUnitString:'',
    //底部内容
    bottomTitle:'增加单位'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 左侧弹出框
     */
    showModal: function (e) {
      //1、初始化数据
      this.data.itemDataSource = [];
      this.data.currentIndex = 0;
      this.data.addUnitString = '';
      //2、显示蒙层和更改标题
      if (e == 1){//剂型
        this.data.title = '选择剂型';
        this.data.subTitle = '剂型选择';
      }else if(e == 5){//供应商
        this.data.title = '选择供应商';
        this.data.subTitle = '供应商选择';
        this.data.bottomTitle = '增加供应商';
      }else{//单位
        this.data.title = '选择单位';
        this.data.subTitle = '单位选择';
        this.data.bottomTitle = '增加单位';
      }
      this.data.listType = e;
      this.setData({
        hideModal: false,
        listType: e,
        title: this.data.title,
        subTitle: this.data.subTitle,
        addUnitString: this.data.addUnitString,
        bottomTitle: this.data.bottomTitle
      });
      //3、创建动画
      this.animation = this.createAnimation();
      //4、调用动画(这里必须添加延时)
      var that = this;
      setTimeout(function () {
        that.fadeIn();//调用显示动画
      }, 200);
      //5、请求列表(1:剂型、2:处方单位、3:拆零单位、4:剂量单位、5:供应商)
      if (e == 1){//剂型
        this.loadDrugFormList();
      }else if(e == 5){//供应商
        this.loadVendorList();
      }
      else{//单位
        this.loadDrugUnitList();
      }
    },

    /**
     * 隐藏弹出框
     */
    hideModal: function () {
      //1、创建动画
      this.animation = this.createAnimation();
      //2、调用隐藏动画(无需添加延时) 
      this.fadeDown();
      //3、隐藏蒙层(蒙层要添加延时)
      var that = this;
      setTimeout(function () {
        that.setData({
          hideModal: true
        })
      }, 900);//先执行下滑动画，再隐藏模块
      //4、通知父类解除滑动
      //设置外界监听
      this.triggerEvent('cancelHasMask');
    },

    /**
     * 显示动画
     */
    fadeIn: function () {
      this.animation.translateX(0).step();
      this.setData({
        //动画实例的export方法导出动画数据传递给组件的animation属性
        animationData: this.animation.export()
      })
    },

    /**
     * 隐藏动画
     */
    fadeDown: function () {
      var width = wx.getSystemInfoSync().windowWidth;
      this.animation.translateX(width).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },

    /**
     * 创建animation
     */
    createAnimation: function (e) {
      var animation = wx.createAnimation({
        //动画的持续时间默认400ms   
        duration: 1000,
        //动画的效果 默认值是linear
        timingFunction: 'ease',
      });
      return animation;
    },

    /**
     * 请求剂型列表
     */
    loadDrugFormList:function(){
      var that = this;
      that.data.itemDataSource = [];
      initDrugJs.loadDrugFormsList(function (success) {
        that.data.itemDataSource = that.data.itemDataSource.concat(success);
        that.setData({
          itemDataSource: that.data.itemDataSource
        });
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        })
      });
    },

    /**
     * 请求处方、拆零、剂量单位列表
     */
    loadDrugUnitList:function(){
      console.log('请求处方、拆零、剂量单位列表');
      var that = this;
      initDrugJs.loadDrugUnitList(function (success) {
        that.data.itemDataSource = that.data.itemDataSource.concat(success);
        that.setData({
          itemDataSource: that.data.itemDataSource
        });
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        })
      });
    },

    /**
     * 查询供应商
     */
    loadVendorList:function(e){
      console.log('查询供应商');
      var that = this;
      drugJs.downloadVendorRequest(function (success) {
        that.data.itemDataSource = that.data.itemDataSource.concat(success);
        that.setData({
          itemDataSource: that.data.itemDataSource
        });
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        })
      });
    },

    /**
     * 增加单位网络请求
     */
    addUnitToList:function(unit){
      console.log('增加单位网络请求');
      var that = this;
      initDrugJs.addUnitToList(unit,function (success) {
        //提示语
        wx.showToast({
          title: '增加成功',
        });
        //选中后触发事件
        var resultDict = {
          id: success.id,
          key_name:success.key_name
        };
        that.triggerEventMethod(resultDict);
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        })
      });
    },

    /**
     * 增加供应商网络请求
     */
    addVendorToList: function (vendor){
      console.log('增加供应商网络请求');
      var that = this;
      initDrugJs.addVendorToList(vendor, function (success) {
        //提示语
        wx.showToast({
          title: '增加成功',
        });
        //选中后触发事件
        var resultDict = {
          id: success.id,
          key_name: success.key_name
        };
        that.triggerEventMethod(resultDict);
      }, function (fail) {
        wx.showToast({
          title: '网络加载失败',
        })
      });
    },

    /**
     * 点击item
     */
    clickChild:function(e){
      console.log('点击item');
      console.log(e.currentTarget.dataset.index);
      //1、将之前选中的取消选中
      var previousItem = this.data.itemDataSource[this.data.currentIndex];
      previousItem.is_select = false;
      //2、重新设置选中
      var item = this.data.itemDataSource[e.currentTarget.dataset.index];
      item.is_select = true;
      //3、记住当前位置
      this.data.currentIndex = e.currentTarget.dataset.index;
      //4、刷新界面
      this.setData({
        itemDataSource: this.data.itemDataSource
      });
    },

    /**
     * 点击确定按钮
     */
    clickSureButton:function(e){
      console.log('点击确定按钮------');
      //1、判断是否是新增单位(优先级高)
      if (this.data.addUnitString){//增加单位/供应商
        if(this.data.listType == 5){//供应商
          this.addVendorToList(this.data.addUnitString);
        }else{//单位
          this.addUnitToList(this.data.addUnitString);
        }
      }else{//非增加单位
        //2、判断有没有选中
        var itemModel = this.data.itemDataSource[this.data.currentIndex];
        if (!itemModel.is_select) {//没有选中
          wx.showToast({
            title: '请选择数据',
          });
          return;
        }
        //3、选中后触发事件
        this.triggerEventMethod(itemModel);
      }
    },

    /**
     * 输入单位
     */
    unitInput:function(e){
      console.log('输入单位');
      console.log(e.detail.value);
      this.data.addUnitString = e.detail.value;
    },

    /**
     * 触发事件封装
     */
    triggerEventMethod:function(itemModel){
      //detail对象，提供给事件监听函数
      var myEventDetail = {
        item: itemModel,
        listType: this.data.listType
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickDrugFormSureButton', myEventDetail, myEventOption);
      //3、隐藏弹出框
      this.hideModal();
    }
  }
})
