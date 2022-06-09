const readFile = require('../utils/readFile')
const path = require('path')
module.exports = async (ctx, next) => {
  const url = ctx.url //    === /api/map
  // 使用replace替换字符串 得到 map
  let filePath = url.replace('/api/', '')
  filePath = '../data/' + filePath + '.json'
  filePath = path.join(__dirname, filePath)
  try {
    const res = await readFile.readFiles(filePath)
    ctx.response.body = res
  } catch (error) {
    const errorMsg = {
      message: '读取文件内容失败, 文件资源不存在',
      status: 404
    }
    ctx.response.body = errorMsg
  }

  console.log(filePath)
  await next()
}