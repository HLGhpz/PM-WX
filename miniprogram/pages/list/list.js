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
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

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
            // let target
          })
          console.log(res.data)
          this.setData({
            targetList: res.data
          })
        })
    }
    else if (this.data.TabCur == 2) {
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
          console.log(res.data)
          this.setData({
            targetList: res.data
          })
        })
    }
    else {
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
          console.log(res.data)
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

  textareaAInput(e) {
    console.log("A", e.detail.value)
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  textareaBInput(e) {
    console.log("B", e.detail.value)
    this.setData({
      textareaAValue: e.detail.value
    })
  },
})