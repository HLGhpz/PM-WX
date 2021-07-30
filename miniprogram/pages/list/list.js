// pages/list/list.js
const moment = require('../../utils/moment')
const db = wx.cloud.database()
const _ = db.command
const target = db.collection('noPigeon')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 1,
    processList: ["立项", "收集", "制作", "发布", "暂停", "待点评", "完成", "中止"],
    bgList: ["bg-lightBlue", "bg-blue", "bg-indigo", "bg-deepPurple", "bg-gery", "bg-pink", "bg-red"],
    lineList: ["line-lightBlue", "line-blue", "line-indigo", "line-deepPurple", "line-gery", "line-pink", "line-red"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reqTarget();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 请求目标数据库
   */
  reqTarget: function () {
    if (this.data.TabCur == 1) {
      target
        .where({
          progress: _.lte(4)
        })
        .get()
        .then(res => {
          res.data.map((value, index) => {
            value.updataDay = Math.floor((new Date - value.updataTime) / (24 * 3600 * 1000))
            value.updataTime = value.updataTime.toLocaleDateString('zh').replace(/\//g, '-')
            value.progressName = this.data.processList[value.progress]
            value.targetBg = this.data.bgList[value.progress]
            value.targetLine = this.data.lineList[value.progress]
          })
          this.setData({
            targetList: res.data
          })
        })
    } else if (this.data.TabCur == 2) {
      target.where({
          progress: _.eq(5)
        })
        .get()
        .then(res => {
          res.data.map((value, index) => {
            // value.updataDay = Math.floor((new Date - value.updataTime) / (24 * 3600 * 1000))
            // value.updataTime = value.updataTime.toLocaleDateString()
            value.progressName = this.data.processList[value.progress]
            // let target
          })
          this.setData({
            targetList: res.data
          })
        })
    } else {
      target.where({
          progress: _.gte(6)
        })
        .get()
        .then(res => {
          res.data.map((value, index) => {
            // value.updataDay = Math.floor((new Date - value.updataTime) / (24 * 3600 * 1000))
            // value.updataTime = value.updataTime.toLocaleDateString()
            value.progressName = this.data.processList[value.progress]
            // let target
          })
          this.setData({
            targetList: res.data
          })
        })
    }

  },

  /**
   * 监听var点击数据
   */
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.reqTarget()
  },

  /**
   * 跳转详情页面
   */
  goToDetail(e) {
    let targetID = e.currentTarget.id
    wx.navigateTo({
      url: `../detail/detail?targetID=${targetID}`,
    })
  },

   /**
   * 列表界面提交数据监听
   */
  formSubmit(e) {
    this.setData({
      targetTitle: e.detail.value.targetTitle,
      targetDetail: e.detail.value.targetDetail
    })
    this.showModal()
  },

  /**
   * 确认提交数据的拟态展示
   */
  showModal(e) {
    console.log("showModal", e)
    this.setData({
      modalName: "DialogModal"
    })
  },

  /**
   * 判断是否将数据加入数据库
   */
  hideModal(e) {
    if (e.currentTarget.id == "sure") {
      target.count().then((e) => {
        this.setData({
          totalTarget: e.total
        })
        target.add({
            data: {
              updataTime: new Date,
              targetName: this.data.targetTitle,
              progress: 0,
              targetID: this.data.totalTarget + 1,
              note: [{
                note: this.data.targetDetail,
                plan: 0,
                time: new Date
              }]
            }
          })
          .then((e) => {
            // console.log("添加数据反馈", e)
            this.cleanData()
            this.reqTarget()
          })
      })
    }
    this.setData({
      modalName: null
    })
  },


  /**
   * 清除输入框
   */
  cleanData() {
    this.setData({
      targetDetail: null,
      targetTitle: null
    })
  }
  
})