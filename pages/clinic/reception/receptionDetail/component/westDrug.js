// pages/clinic/reception/receptionDetail/component/westDrug.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 组号
     */
    groupNo:{
      type: String,
      value: '1',
    },
    /**
     * 图片
     */
    imageURL: {
      type: String,
      value: '/image/clinic/img_default.png',
    },
    /**
     * 通用名字
     */
    generalName: {
      type: String,
      value: '药品初始药品初始',
    },
    /**
     * 批次
     */
    batch: {
      type: String,
      value: '2019-10-19',
    },
    /**
     * 规格
     */
    spec: {
      type: String,
      value: '50粒/每瓶',
    },
    /**
     * 服用方法
     */
    usage:{
      type: String,
      value: '1日一次;每次3粒',
    },
    /**
     * 生产厂商
     */
    manufacturer:{
      type: String,
      value: '奥美制药厂',
    },
    /**
     * 价格
     */
    price:{
      type: String,
      value: '1.00',
    },
    /**
     * 数目
     */
    count: {
      type: String,
      value: '3瓶',
    },
    /**
     * 是否隐藏组号
     */
    isHiddenGroupNo:{
      type: Boolean,
      value: false,
    },
    /**
     * 是否使用默认图片
     */
    isDefaultImage:{
      type: Boolean,
      value: true,
    },
    /**
     * 是否隐藏批次
     */
    isHiddenBatch:{
      type: Boolean,
      value: false,
    },
    /**
     * 是否隐藏用法
     */
    isHiddenUsage: {
      type: Boolean,
      value: false,
    },
    /**
     * 是否隐藏顶部
     */
    isShowTop:{
      type: Boolean,
      value: true,
    },
    /**
     * 是否隐藏底部
     */
    isShowBottom: {
      type: Boolean,
      value: true,
    },
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
    errorFunction: function () {
      this.setData({
        imageURL: '/image/clinic/img_default.png'
      })
    }
  }
})
