// 导入 koa
const Koa = require('koa')
const app = new Koa()

const koaTime = require('./middleware/koa_time')
app.use(koaTime)

const koaHeader = require('./middleware/koa_header')
app.use(koaHeader)

const koaRead = require('./middleware/koa_readFile')
app.use(koaRead)

app.listen(8888, () => {
  console.log('koa启动成功');
})

const websocket = require('./service/websocketServer.js')
websocket.listen()