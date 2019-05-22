
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 组号
     */
    groupNumber: {
      type: String,
      value: '1',
    },
    /**
     * 图片
     */
    image: {
      type: String,
      value: '/image/img_ypmr.png',
    },
    /**
     * 药品名称
     */
    general_name: {
      type: String,
      value: '药品名称',
    },
    /**
     * 规格
     */
    spec: {
      type: String,
      value: '规格',
    },
    /**
     * 厂商
     */
    manufacturer: {
      type: String,
      value: '厂商',
    },
    /**
     * 失效日期
     */
    expire_date: {
      type: String,
      value: '选择失效日期',
    },
    /**
     * 批号
     */
    batch_no: {
      type: String,
      value: '',
    },
    /**
     * 进货单价
     */
    price: {
      type: String,
      value: '',
    },
    /**
     * 进货数量
     */
    count: {
      type: String,
      value: '',
    },
    /**
     * 进货单位
     */
    unit: {
      type: String,
      value: '盒',
    },
    /**
     * 小计
     */
    cost: {
      type: String,
      value: '0.0000',
    },
    /**
     * 是否隐藏删除按钮
     */
    isHiddenDelete:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 失效日期
     */
    bindExpireDate:function(e){
      var date = e.detail.value;
      //刷新界面
      this.data.expire_date = date;
      this.setData({
        expire_date: this.data.expire_date,
      });
      //通知父类数据改变
      this.passData();
    },

    /**
     * 批号
     */
    batchBatchInput:function(e){
      var batch = e.detail.value;
      //刷新界面
      this.data.batch_no = batch;
      this.setData({
        batch_no: this.data.batch_no
      });
      //通知父类数据改变
      this.passData();
    },

    /**
     * 进货单价(记得判断是否合法)
     */
    batchPriceInput:function(e){
      var cost = e.detail.value;
      //刷新界面
      this.data.cost = cost;
      this.setData({
        cost: this.data.cost,
      });
      //计算小计
      this.dealCost();
      //通知父类数据改变
      this.passData();
    },

    /**
     * 进货数量(输入)
     */
    batchCountInput:function(e){
      var count = e.detail.value;
      //刷新界面
      this.data.count = count;
      this.setData({
        count: this.data.count
      });
      //计算小计
      this.dealCost();
      //通知父类数据改变
      this.passData();  
    },

    /**
     * 进货数量(-)
     */
    clickReduceButton:function(e){
      //判断当前是否小于1
      if(this.data.count < 1){
        return;
      }
      //刷新界面
      this.data.count --;
      this.setData({
        count: this.data.count,
      });
      //计算小计
      this.dealCost();
      //通知父类数据变化
      this.passData();
    },

    /**
     * 进货数量(+)
     */
    clickAddButton:function(e){
      //刷新界面
      this.data.count ++;
      this.setData({
        count: this.data.count,
      });
      //计算小计
      this.dealCost();
      //通知父类数据变化
      this.passData();
    },

    /**
     * 计算小计
     */
    dealCost:function(){
      //计算并刷新界面
      this.data.price = this.data.cost * this.data.count;
      this.setData({
        price: this.data.price
      });
    },

    /**
     * 调用触发事件(反向传值)
     */
    passData:function(){
      //detail对象，提供给事件监听函数
      var myEventDetail = {
        expire_date: this.data.expire_date,//失效日期
        batch_no: this.data.batch_no,//批号
        price: this.data.price,//进货单价
        count: this.data.count,//进货数量
        cost:this.data.cost//小计
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickdetailcell', myEventDetail, myEventOption);
    },

    /**
     * 点击删除按钮
     */
    clickDeleteButton:function(e){
      console.log('点击删除按钮点击删除按钮点击删除按钮');
      //detail对象，提供给事件监听函数
      var myEventDetail = {
      }
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickdeleteImage', myEventDetail, myEventOption);
    }
  }
})
