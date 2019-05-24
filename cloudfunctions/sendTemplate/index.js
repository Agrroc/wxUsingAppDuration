// 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    console.log("cloud success")
    const wxContext = cloud.getWXContext()
    const result = await cloud.openapi.templateMessage.send({
      touser: wxContext.OPENID,
      page: 'index',
      data: {
        keyword1: {
          value: '339208499'
        },
        keyword2: {
          value: '2015年01月05日 12:30'
        },
        keyword3: {
          value: '腾讯微信总部'
        }
      },
      templateId: 'A6Z85_zDI5WoeMh85QgHJNvsEk1TvrBOEZc5PfpRMAg',
      formId: event.formId,
      emphasisKeyword: 'keyword1.DATA'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}