export default class ScoketServer {
  /**
  * 单例
  */

  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new ScoketServer()
    }
    return this.instance
  }

  ws = null

  // 存储回调函数
  callBack = {}

  // 连接状态
  connectStatus = false

  // 重连次数
  connectDegree = 0

  containDegree = 0
  // 连接服务器
  connect() {
    if (!window.WebSocket) {
      return console.log('你的浏览器不支持 WebSocket')
    }

    this.ws = new WebSocket('ws://localhost:9999')

    this.ws.onopen = () => {
      this.connectStatus = true
      this.containDegree = 0
    }
    this.ws.onclose = () => {
      this.connectStatus = false
      this.containDegree++
      setTimeout(() => {
        this.connect()
      }, this.containDegree * 500)
    }
    this.ws.onmessage = (msg) => {
      const messageData = JSON.parse(msg.data)
      const socketType = messageData.socketType
      // 判断函数是否存在
      if (this.callBack[socketType]) {
        const action = messageData.action
        if (action === 'getData') {
          const recvData = JSON.parse(messageData.data)
          this.callBack[socketType].call(this, recvData)
        } else if (action === 'fullScreen') {
          this.callBack[socketType].call(this, messageData)
        } else if (action === 'themeChange') {
          this.callBack[socketType].call(this, messageData)
        }
      }
    }
  }

  // 注册回调函数
  registerCallBack = (socketType, cb) => {
    this.callBack[socketType] = cb
  }

  unRegisterCallBack = (socketType) => {
    this.callBack[socketType] = null
  }

  // 发送数据
  send = (data) => {
    if (this.connectStatus) {
      this.connectDegree = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.connectDegree++
      setTimeout(() => {
        this.ws.send(JSON.stringify(data))
      }, this.connectDegree * 300)
    }
  }
}
