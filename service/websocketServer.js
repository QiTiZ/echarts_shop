const path = require('path')
const getWebSocketFiles = require('../utils/readFile.js')

const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: 9999
})

module.exports.listen = () => {
  wss.on('connection', client => {
    console.log('有客户端连接成功了');
    client.on('message', async msg => {
      console.log('hello' + msg);

      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        // payload.chartName // trend map hot seller stock rank
        let filtPath = '../data/' + payload.chartName + '.json'
        filtPath = path.join(__dirname, filtPath)
        const res = await getWebSocketFiles.readFiles(filtPath)
        // 新增一个data字段 data就是json文件中的内容
        payload.data = res
        // 发送数据
        client.send(JSON.stringify(payload))
      } else {
        // 将数据原封不动发送出去
        wss.clients.forEach(client => {
          client.send('' + msg)
        })
      }
    })
  })
}
