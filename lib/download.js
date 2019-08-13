const download = require('download-git-repo')


/**
 * 用于拉取远程代码到目标路径
 *
 * @param {*} target 目标路径
 * @returns Promise
 */
function downloadTemplate(target) {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    download('https://github.com/facebook/react.git#master', target, { clone: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(target)
        }
      })
  })
}

module.exports = downloadTemplate