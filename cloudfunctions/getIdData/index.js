// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const target = db.collection('noPigeon')

exports.main = async (event, context) => {
  console.log('event', event)
  const wxContext = cloud.getWXContext()
  let targetDetail = await target.where({
    _openid: wxContext.OPENID,
    targetID: event.targetID
  }).get()
  let targetData = targetDetail.data[0]
  await Promise.all(targetData.note.map((value, index) => {
    value.updataDate = moment(value.time).format("YY-MM-DD")
    value.updataTime = moment(value.time).format("kk:mm:ss")
  }))

  return {
    targetData
  }

}