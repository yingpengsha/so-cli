const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')

/**
 * 用于拉取远程代码到目标路径
 *
 * @param {*} target 目标路径
 * @returns Promise
 */
function downloadTemplate(target) {
  const spinner = ora(`正在下载项目模板`)
  spinner.start()
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    download('github:yingpengsha/react-template#master', target, { clone: true }, (err) => {
        if (err) {
          spinner.fail()
          reject(err)
        } else {
          spinner.succeed()
          resolve(target)
        }
      })
  })
}

module.exports = downloadTemplate