// pages/detail/detail.js
const db = wx.cloud.database()
const _ = db.command
const target = db.collection('noPigeon')


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
    this.setData({
      targetID: options.targetID
    })
    this.reqTarget()
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
   * 请求目标详细说明
   */
  reqTarget: function () {
    target
      .where({
        targetID: _.eq(this.data.targetID * 1)
      })
      .get()
      .then((value, index) => {
        let target = value.data[0]
        target.time = target.updataTime.toLocaleDateString('zh').replace(/\//g, '-')
        target.note.map((value, index) => {
          let Hour = value.time.getHours().toString()
          let Minute = 0
          if (value.time.getMinutes() < 10) {
            Minute = '0' + value.time.getMinutes().toString()
          } else {
            Minute = value.time.getMinutes().toString()
          }
          value.hourMinute = Hour + ':' + Minute
          value.time = value.time.toLocaleDateString('zh').replace(/\//g, '-')
          value.planName = this.data.planList[value.plan]
          value.planBg = this.data.bgList[value.plan]
          value.planLine = this.data.lineList[value.plan]
          // console.log(value)
        })
        this.setData({
          targetDetail: target
        })
        // console.log(this.data.targetDetail)
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
              "plan": this.data.step,
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
          this.reqTarget()
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
              "plan": this.data.step * 1,
              "time": new Date
            }),
            progress: this.data.step * 1,
            updataTime: new Date
          }
        })
        .then(() => {
          this.reqTarget()
        })
    }

  },

  formSubmit(e) {
    this.setData({
      step: e.detail.value.step,
      note: e.detail.value.note
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