
Component({
  options: {
    //在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 图片
     */
    image: {
      type: String,
      value: '/image/img_ypmr.png',
    },
    /**
     * 通用名
     */
    common_name: {
      type: String,
      value: '',
    },
    /**
     * 厂商
     */
    manufacturer: {
      type: String,
      value: '',
    },
    /**
     * 商品名
     */
    key_name: {
      type: String,
      value: '',
    },
    /**
     * 进货价
     */
    cost: {
      type: String,
      value: '',
    },
    /**
     * 处方价
     */
    min_price: {
      type: String,
      value: '',
    },
    /**
     * 进货价和处方价单位
     */
    min_unit: {
      type: String,
      value: '',
    },
    /**
     * 库存(包含单位)
     */
    realCount:{
      type: String,
      value: '',
    },
    /**
     * 规格
     */
    spec: {
      type: String,
      value: '',
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
     * 公有方法(无下划线)
     */
    onTap() {
      //detail对象，提供给事件监听函数
      var myEventDetail = {}
      //触发事件的选项
      var myEventOption = {}
      //设置外界监听
      this.triggerEvent('clickcell', myEventDetail, myEventOption)
    },

    /**
     * 下载图片失败
     */
    loadimage() {
      console.log('下载图片下载图片下载图片下载图片');
      this.properties.image = '/image/img_ypmr.png';
      this.setData({
        image: this.properties.image
      });
    }
  }
})
