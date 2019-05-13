Component({
  /**
   * 在组件定义时的选项中启用多slot支持
   */
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties:{
    title:{
      type:String,
      value:'正在努力加载中...'
    },
    image:{
      type: String,
      value: '/image/clinic/Loading.png'
    },
    isHideBottomView:{
      type: Boolean,//是否隐藏底部加载圈
      value: true
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
  methods:{
    
  }
})