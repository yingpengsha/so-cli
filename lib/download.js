const path = require('path')
const ora = require('ora')
const fs = require('fs-extra')

function downloadTemplate(target, template) {
  const templatePath = path.resolve(__dirname, `./template/${template}`)
  console.log(templatePath)
  const spinner = ora(`Downloading`)
  spinner.start()
  target = path.resolve(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    fs.copy(templatePath, target, (err) => {
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