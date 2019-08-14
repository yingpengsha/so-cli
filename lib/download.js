const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')

function downloadTemplate(target, url) {
  const spinner = ora(`Downloading`)
  spinner.start()
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    download(url, target, { clone: true }, (err) => {
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