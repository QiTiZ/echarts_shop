const fs = require('fs')

module.exports.readFiles = (filePath) => {
  return new Promise((reject, resolve) => {
    fs.readFile(filePath, 'utf-8', (success, error) => {
      // 失败
      if (error) {
        reject(error)
      } else {
        // 成功
        resolve(success)
      }
    })
  })
}