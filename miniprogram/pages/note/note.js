// pages/note/note.js
const db = wx.cloud.database()
const _ = db.command
const target = db.collection('noPigeon')


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
            this.cleanData()
            wx.navigateBack({
              delta: 1,
            })
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
  },
})