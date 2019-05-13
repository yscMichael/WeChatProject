Component({
  options: {
    //在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
    
  /**
   * 组件的属性列表
   */
  properties: {
    drugName: {//药品名称
      type: String,
      value: '',
    },
    key_name: {//入库单号
      type: String,
      value: '',
    },
    handle_entity: {//入库人
      type: String,
      value: '',
    },
    audit_entity: {//审核人
      type: String,
      value: '',
    },
    cost: {//金钱
      type: String,
      value: '',
    },
    isHiddenAuditEntity:{//是否隐藏审核人
      type: Boolean,
      value: true,
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
     * 私有方法(以下划线开头)
     */
  }
})
