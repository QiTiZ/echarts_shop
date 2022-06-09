module.exports = async (ctx, next) => {
  const startTime = Date.now()
  await next()
  const endTime = Date.now()

  const expendTime = endTime - startTime
  ctx.set('X-Response-Time', expendTime + 'ms')
}