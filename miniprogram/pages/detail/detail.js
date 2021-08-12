// pages/detail/detail.js
const db = wx.cloud.database()
const _ = db.command
const target = db.collection('noPigeon')
const moment = require('../../utils/moment')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: ["立项", "收集", "制作", "发布", "普通"],
    bgList: ["bg-lightBlue", "bg-blue", "bg-indigo", "bg-deepPurple", "bg-green", "bg-pink", "bg-red"],
    lineList: ["line-lightBlue", "line-blue", "line-indigo", "line-deepPurple", "line-green", "line-pink", "line-red"],
    step: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      targetID: options.id * 1
    })
    this.reqIdData()
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
   * 根据TargetId请求对应数据
   */
  reqIdData: function () {
    wx.cloud.callFunction({
      name: 'getIdData',
      data: {
        targetID: this.data.targetID,
      }
    })
      .then((res) => {
        let target = res.result.targetData
        target.note.map((value, index) => {
          value.planName = this.data.planList[value.plan]
          value.planBg = this.data.bgList[value.plan]
          value.planLine = this.data.lineList[value.plan]
        })
        this.setData({
          targetDetail: target,
        })
        console.log('target', target)
      })
  },

  /**
   * 监听Target数据的提交
   */
  updataPlan() {
    console.log("updataPlan")
    if (this.data.step == 4 || this.data.step <= this.data.targetDetail.progress) {
      target
        .where({
          targetID: _.eq(this.data.targetDetail.targetID * 1)
        })
        .update({
          data: {
            note: _.push({
              "note": this.data.note,
              "link": this.data.link,
              "plan": this.data.step * 1,
              "time": new Date
            }),
            updataTime: new Date
          }
        })
        .then(() => {
          this.setData({
            note: null,
            step: 0
          })
          this.reqIdData()
        })
    } else {
      target
        .where({
          targetID: _.eq(this.data.targetDetail.targetID * 1)
        })
        .update({
          data: {
            note: _.push({
              "note": this.data.note,
              "link": this.data.link,
              "plan": this.data.step * 1,
              "time": new Date
            }),
            progress: this.data.step * 1,
            updataTime: new Date
          }
        })
        .then(() => {
          this.setData({
            note: null,
            step: 0
          })
          this.reqIdData()
        })
    }

  },

  pickerChange(e) {
    console.log('pick', e)
    this.setData({
      step: e.detail.value * 1
    })
  },

  formSubmit(e) {
    this.setData({
      note: e.detail.value.note,
      link: e.detail.value.link
    })
    this.showModal()
  },

  showModal(e) {
    // console.log(showModa)
    this.setData({
      modalName: "DialogModal"
    })
  },

  hideModal(e) {
    if (e.currentTarget.id == "ensure") {
      this.updataPlan()
    }
    this.setData({
      modalName: null
    })
  }
})