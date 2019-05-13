//获取应用实例
const app = getApp();
//网络请求
var drugJs = require('../../../../../api/drugRequest/drugRequest.js');

Component({
  options: {
    //在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    orginalData:[],//未经过处理的数据
    dataSource: [],//经过处理的数据
    page: 1,
    rows: 15,
    totalCount: 0,
    isHideTopView: false,//是否隐藏顶部下拉刷新框
    isHideBottomView: true,//是否隐藏底部上拉加载框
    isHiddenNoData: true,//是否隐藏无数据提示
    isHiddenCellBottom: true,//是否隐藏cell底部按钮
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击cell
     */
    onStoragedListCell(e) {
      //通知父类
      //detail对象，提供给事件监听函数
      var listDict = {
        //入库时间
        in_date: e.currentTarget.dataset.item.in_date,
        //入库人
        handle_entity: e.currentTarget.dataset.item.handle_entity,
        //仓库
        warehouse: e.currentTarget.dataset.item.warehouse_id,
        //供应商
        vendor: e.currentTarget.dataset.item.vendor_id,
        //总金额
        totalPrice: e.currentTarget.dataset.item.price,
        //入库金额
        actualPrice: e.currentTarget.dataset.item.cost
      }
      var myEventDetail = {
        batchId: e.currentTarget.id,
        listModel: listDict,
        isStoraging: false
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickstoragedcell', myEventDetail, myEventOption)
    },

    /**
     * 开始刷新数据
     */
    storagedRefresh() {
      wx.showLoading({
        title: '正在拼命加载数据...',
      });
      this.refreshData();
    },

    /**
     * 开始上拉加载数据
     */
    storagedLoadMore() {
      //1、显示加载框
      this.data.isHideBottomView = false;
      this.setData({
        isHideBottomView: this.data.isHideBottomView,
      });
      //2、网络请求
      this._loadMoreData();
    },

    /**
     * 下拉刷新网络请求
     */
    refreshData: function () {
      //1、数据初始化
      this.data.dataSource = [];
      this.data.orginalData = [];
      this.data.page = 1;
      this.data.totalCount = 0;
      this.setData({
        dataSource: this.data.dataSource,
        page: this.data.page,
        totalCount: this.data.totalCount,
      })
      //2、开始网络请求
      var that = this;
      setTimeout(function () {
        that._loadData();
      }, 1000);
    },

    /**
     * 上拉加载网络请求
     */
    _loadMoreData: function () {
      //1、判断是否可以加载更多数据
      if (this.data.totalCount <= this.data.orginalData.length) {
        wx.showToast({
          title: '无更多数据加载',
        });
        this.data.isHideBottomView = true;
        this.setData({
          isHideBottomView: this.data.isHideBottomView,
        });
      }
      else {
        //2、数据初始化
        this.data.page++;
        //3、开始网络请求  
        var that = this;
        setTimeout(function () {
          that._loadData();
        }, 1000);
      }
    },

    /**
     * 网络请求
     */
    _loadData: function () {
      //1、网络请求、加载数据
      var that = this;
      drugJs.getStoragedData(this.data.page, function (success, totalCount){
        //总数赋值
        that.data.totalCount = totalCount;
        //保存数据
        that.data.orginalData = that.data.orginalData.concat(success);
        //对数据进行处理(分组处理、dataSource记得清空)
        var resultArray = drugJs.dealStoragedData(that.data.orginalData);
        that.data.dataSource = [];
        that.data.dataSource = that.data.dataSource.concat(resultArray);
        //刷新界面
        that.setData({
          dataSource: that.data.dataSource,
        });
        //停止显示加载动画
        wx.hideLoading();
        //底部加载框动画隐藏
        that.data.isHideBottomView = true;
        that.setData({
          isHideBottomView: that.data.isHideBottomView,
        });
        //通知父类网络请求完成
        that.triggerEvent("netWorkSuccess");
        //处理无数据情况
        that._dealNoData();
      },function(fail){
        //停止显示加载动画
        wx.hideLoading();
        //网络请求失败
        wx.showToast({
          title: '网络加载失败',
        });
        //底部加载框动画隐藏
        that.data.isHideBottomView = true;
        that.setData({
          isHideBottomView: that.data.isHideBottomView,
        });
        //通知父类网络请求完成
        that.triggerEvent("netWorkSuccess");
        //处理无数据情况
        that._dealNoData();
      });
    },

    /**
     * 处理无数据
     */
    _dealNoData: function () {
      //处理无数据
      if (this.data.orginalData.length == 0) {
        this.data.isHiddenNoData = false;
      } else {
        this.data.isHiddenNoData = true;
      }
      this.setData({
        isHiddenNoData: this.data.isHiddenNoData
      });
    }
  }
})
