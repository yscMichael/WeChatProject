// pages/clinic/reception/receptionDetail/component/chineseDrug.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 组号
     */
    groupNo: {
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
     * 规格
     */
    spec: {
      type: String,
      value: '50粒/每瓶',
    },
    /**
     * 数目
     */
    count: {
      type: String,
      value: '3瓶',
    },
    /**
     * 用法
     */
    drugUsage:{
      type: String,
      value: '每日1剂/贴 用药3天 共3剂/贴',
    },
    /**
     * 是否隐藏组号
     */
    isHiddenGroupNo: {
      type: Boolean,
      value: false,
    },
    /**
     * 是否使用默认图片
     */
    isDefaultImage: {
      type: Boolean,
      value: true,
    },
    /**
     * 是否隐藏顶部
     */
    isShowTop: {
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

  }
})
