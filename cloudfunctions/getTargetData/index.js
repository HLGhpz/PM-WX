// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const target = db.collection('noPigeon')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event', event)
  const wxContext = cloud.getWXContext()
  let targetList = await target.where({
    _openid: wxContext.OPENID,
    progress: _.in(event.progressList)
  })
    .skip(event.skipPage)
    .limit(event.pageSize)
    .get()
  await Promise.all(targetList.data.map((value, index) => {
    value.updataDay = moment().diff(value.updataTime, 'days')
    value.updataDate = moment(value.updataTime).format("YY-MM-DD")
    value.updataTime = moment(value.updataTime).format("hh:mm:ss")
    // await Promise.all(value.note.map((value, index) => {
    //   value.updataDate = moment(value.time).format("YYYY-MM-DD")
    //   value.updataTime = moment(value.time).format("hh:mm:ss")
    // }))
  }))

  return {
    targetList
  }

}