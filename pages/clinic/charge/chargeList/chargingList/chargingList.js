//获取应用实例
const app = getApp();
//网络请求
var chargeJs = require('../../../../../api/chargeRequest/chargeRequest.js');

Component({
  options: {
    //在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  /**
   * 组件私有数据
   */
  data: {
    dataSource: [],
    page: 1,
    rows: 15,
    totalCount: 0,
    isHideTopView: false,//是否隐藏下拉加载框
    isHideBottomView: true,//是否隐藏上拉加载框
    isHiddenNoData: true,//是否隐藏无数据提示
    isHiddenCellBottom: false,//是否隐藏cell底部按钮
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击cell
     */
    onChargingListCell(e) {
      //通知父类
      //detail对象，提供给事件监听函数
      var myEventDetail = {
        recordId: e.currentTarget.id,
        isCharging:true
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickchargingcell', myEventDetail, myEventOption)
    },
    /**
     * 开始刷新数据
     */
    chargingRefresh() {
      wx.showLoading({
        title: '正在拼命加载数据...',
      });
      this._refreshData();
    },
    /**
     * 开始上拉加载数据
     */
    chargingLoadMore() {
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
    _refreshData: function () {
      //1、数据初始化
      this.data.dataSource = [];
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
      if (this.data.totalCount <= this.data.dataSource.length) {
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
      chargeJs.loadUnPayDataListData(this.data.keyword, this.data.page, this.data.rows,
        function (success, totalCount) {
          //总数赋值
          that.data.totalCount = totalCount;
          //添加元素
          that.data.dataSource = that.data.dataSource.concat(success);
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
        }, function (fail) {
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
      if (this.data.dataSource.length == 0) {
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