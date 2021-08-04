// pages/list/list.js
const db = wx.cloud.database()
const _ = db.command
const target = db.collection('noPigeon')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    pageSize: 8,
    loadMore: false,
    footShow: false,
    TabCur: 1,
    processList: ["立项", "收集", "制作", "发布", "暂停", "待点评", "完成", "中止"],
    bgList: ["bg-lightBlue", "bg-blue", "bg-indigo", "bg-deepPurple", "bg-gery", "bg-pink", "bg-red"],
    lineList: ["line-lightBlue", "line-blue", "line-indigo", "line-deepPurple", "line-gery", "line-pink", "line-red"],
    targetList: [],
    lastListLength: 0,
    totolLength: 0
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
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.reqTarget();
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
    if (this.data.lastListLength < 8) {
      this.setData({
        loadMore: false,
        footShow: true
      })      
    } else {
      this.setData({
        loadMore: true
      })
      this.reqTarget()
    }
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
    // function reqTarget() {
    console.log("skipPage", this.data.currentPage)
    if (this.data.TabCur == 1) {
      this.setData({
        progressList: [0, 1, 2, 3, 4]
      })

    } else if (this.data.TabCur == 2) {
      this.setData({
        progressList: [5]
      })
    } else {
      this.setData({
        progressList: [5, 6, 7, 8, 9]
      })
    }

    wx.cloud.callFunction({
      name: 'getTargetData',
      data: {
        progressList: this.data.progressList,
        skipPage: this.data.currentPage * this.data.pageSize,
        pageSize: this.data.pageSize
      }
    }).then((res) => {
      let targetList = res.result.targetList.data
      targetList.map((value, index) => {
        value.progressName = this.data.processList[value.progress]
        value.targetBg = this.data.bgList[value.progress]
        value.targetLine = this.data.lineList[value.progress]
      })
      this.setData({
        lastListLength: targetList.length,
        targetList: this.data.targetList.concat(targetList),
        currentPage: ++this.data.currentPage,
        totolLength: this.data.totolLength + targetList.length
      })
    })

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
   * 跳转详情页面
   */


  /**
   * 添加项目
   */
  addItem() {
    wx.navigateTo({
      url: '../note/note',
    }).then((e) => {
      console.log("note")
    })
  }

})