//获取应用实例
const app = getApp();
//网络请求
var initJs = require('../../../../../api/initDrugRequest/initDrugRequest.js');

Component({
  options: {
    //在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    screenWidth:{
      type: Number,
      value:0
    },
    screenHeight:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataSource: [], 
    page: 1,
    rows: 15,
    totalCount: 0,
    isHideTopView: false,//是否隐藏顶部下拉刷新框
    isHideBottomView: true,//是否隐藏底部上拉加载框
    isHiddenNoData: false,//是否隐藏无数据提示
    isRefresh:false,//当前在下拉刷新(暂时不清空数据)
    isLoadingMore:false,//当前在上拉加载()
    isCurrentPage:1,//保留当前页码
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击cell
     */
    onWestDrugListCell(e) {
      //通知父类
      //detail对象，提供给事件监听函数
      var myEventDetail = {
        listModel: e.currentTarget.dataset.item,
        drugType: 1
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickwestcell', myEventDetail, myEventOption)
    },

    /**
     * 刷新底部数量(drugType=0是为了区分)
     */
    refreshBottomData:function(){
      //通知父类
      //detail对象，提供给事件监听函数
      var myEventDetail = {
        count: this.data.totalCount,
        drugType: 0
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickwestcell', myEventDetail, myEventOption)
    },

    /**
     * 开始刷新数据
     */
    westRefresh() {
      wx.showLoading({
        title: '正在拼命加载数据...',
      });
      this._refreshData();
    },

    /**
     * 开始上拉加载数据
     */
    westLoadMore() {
      //1、网络请求
      this._loadMoreData();
    },

    /**
     * 下拉刷新网络请求
     */
    _refreshData: function () {
      //1、正在下拉刷新或者上拉加载，不能进行二次下拉刷新
      if(this.data.isRefresh || this.data.isLoadingMore){
         return;   
      }
      //2、显示动画框(隐藏上拉加载动画)
      this.data.isHideTopView = false;
      this.data.isHideBottomView = true;
      this.setData({
        isHideTopView: this.data.isHideTopView,
        isHideBottomView: this.data.isHideBottomView
      });
      //3、数据初始化(暂时不清空数据、保证平稳过渡)
      this.data.isRefresh = true;
      //网络请求失败、将isCurrentPage赋值给page
      this.data.isCurrentPage = this.data.page;
      this.data.page = 1;
      //4、开始网络请求
      var that = this;
      setTimeout(function () {
        that._loadData();
      }, 500);
    },

    /**
     * 上拉加载网络请求
     */
    _loadMoreData: function () {
      var that = this;
      //1、正在下拉刷新或者上拉加载、不能二次上拉加载
      if(this.data.isRefresh || this.data.isLoadingMore){
        return;
      }
      //2、判断是否可以加载更多数据
      if (this.data.totalCount <= this.data.dataSource.length) {
        wx.showToast({
          title: '无更多数据加载',
        });
        //延时隐藏动画
        setTimeout(function(){
          that.data.isHideTopView = false;
          that.data.isHideBottomView = true;
          that.setData({
            isHideTopView: this.data.isHideTopView,
            isHideBottomView: that.data.isHideBottomView,
          });
        },1000);
      }else {
        //3、显示动画
        this.data.isHideBottomView = false;
        this.setData({
          isHideBottomView: this.data.isHideBottomView
        });
        this.data.isLoadingMore = true;
        //4、数据初始化
        this.data.page ++;
        //5、开始网络请求  
        var that = this;
        setTimeout(function () {
          that._loadData();
        }, 500);
      }
    },

    /**
     * 网络请求
     */
    _loadData: function () {
      //1、网络请求、加载数据
      var that = this;
      initJs.downloadDrugListRequest(1, this.data.page,
        function (success, totalCount) {
          //如果是下拉刷新
          if(that.data.isRefresh){
            that.data.isRefresh = !that.data.isRefresh;//解锁
            that.data.dataSource = [];//数据一定清空
          }
          //如果是上拉加载
          if(that.data.isLoadingMore){
            that.data.isLoadingMore = !that.data.isLoadingMore;//解锁
          }
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
          that.data.isHideTopView = true;
          that.setData({
            isHideBottomView: that.data.isHideBottomView,
            isHideTopView: that.data.isHideTopView
          });
          //通知父类网络请求完成
          that.triggerEvent("netWorkSuccess");
          //处理无数据情况
          that._dealNoData();
          //刷新底部数据
          that.refreshBottomData();
        }, function (fail) {
          //如果是下拉刷新
          if (that.data.isRefresh) {
            that.data.isRefresh = !that.data.isRefresh;//解锁
            that.data.page = that.data.isCurrentPage;//数据还原
          }
          //如果是上拉加载
          if (that.data.isLoadingMore) {
            that.data.isLoadingMore = !that.data.isLoadingMore;//解锁
          }
          //停止显示加载动画
          wx.hideLoading();
          //网络请求失败
          wx.showToast({
            title: '网络加载失败',
          });
          //底部加载框动画隐藏
          that.data.isHideBottomView = true;
          that.data.isHideTopView = true;
          that.setData({
            isHideBottomView: that.data.isHideBottomView,
            isHideTopView: that.data.isHideTopView
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
    },

    /**
     * 获取scroll高度
     */
    getScrollHeight() {
      setTimeout(function(){
        wx.createSelectorQuery().select('#scroll').fields({
          dataset: true,
          size: true,
          scrollOffset: true,
          properties: ['scrollX', 'scrollY'],
          computedStyle: ['margin', 'backgroundColor'],
          context: true,
        }, function (res) {
          console.log('获取scroll高度');
          console.log(res);
          // res.dataset // 节点的dataset
          // res.width // 节点的宽度
          // res.height // 节点的高度
          // res.scrollLeft // 节点的水平滚动位置
          // res.scrollTop // 节点的竖直滚动位置
          // res.scrollX // 节点 scroll-x 属性的当前值
          // res.scrollY // 节点 scroll-y 属性的当前值
          // // 此处返回指定要返回的样式名
          // res.margin
          // res.backgroundColor
          // res.context // 节点对应的 Context 对象
        }).exec()
      },2000);
    },

    /**
     * 下拉刷新动作
     */
    upper: function (e) {
      console.log('下拉刷新动作');
      this.westRefresh();
    },

    /**
     * 上拉加载动作
     */
    lower: function (e) {
      console.log('上拉加载动作');
      this.westLoadMore();
    }
  }
})
