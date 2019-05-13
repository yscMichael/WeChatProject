Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件属性列表
   */
  properties: {
    imageURL: {
      type: String,
      value: '../../../image/clinic/chargeList.png',
    },
    title: {
      type: String,
      value: '收费列表',
    },
    subTitle:{
      type: String,
      value: '当前等待收费的患者',
    }
  },
  /**
   * 组件私有数据
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
      var clickListDetail = {}
      //触发事件的选项
      var clickListOption = {}
      //设置外界监听
      this.triggerEvent('clicklist', clickListDetail, clickListOption)
    },

    /**
     * 私有方法(有下划线)
     */
  },
})