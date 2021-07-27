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
    index: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.targetID;
    this.reqTarget(id)
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
  reqTarget: function (id) {
    target
      .where({
        targetID: _.eq(id * 1)
      })
      .get()
      .then((value, index) => {
        let target = value.data[0]
        console.log(target)
        target.time = target.updataTime.toLocaleDateString('zh').replace(/\//g, '-')
        let note = target.note.map((value, index) => {
          value.time = value.time.toLocaleDateString('zh').replace(/\//g, '-')
          value.planName = this.data.planList[value.plan]
          // console.log(value)
        })
        this.setData({
          targetDetail: target
        })
        // console.log(this.data.targetDetail)
      })
  },

  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },

  addNote() {

  },

  PickerChange(e) {
    // console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  /**
  * 监听Target数据的提交
  */
  updataPlan() {
    if (this.data.index == 4 || this.data.index <= this.data.targetDetail.progress) {
      console.log(this.data.targetDetail.targetID)
      target
        .where({
          targetID: _.eq(this.data.targetDetail.targetID * 1)
        })
        .update({
          data: {
            note: _.push({ "note": this.data.textareaAValue, "plan": this.data.index, "time": new Date }),
            updataTime: _.set(new Date)
          }
        })
    }
    else {
      target
        .where({
          targetID: _.eq(this.data.targetDetail.targetID * 1)
        })
        .update({
          data: {
            note: _.push({ "note": this.data.textareaAValue, "plan": this.data.index, "time": new Date }),
            progress: _.set(this.data.index),
            updataTime: _set(new Date)
          }
        })
    }

  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
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