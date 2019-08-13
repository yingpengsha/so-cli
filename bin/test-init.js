#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const download = require('../lib/download')

program.usage('<project-name>')
        .parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {
  program.help() 
  return
}

const list = glob.sync('*')  // 遍历当前目录
let rootName = path.basename(process.cwd())

if (list.length) {
  if (list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join('.', name))
      const isDir = fs.stat(fileName).isDirectory()
      return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
    console.log(`项目 ${projectName} 已经存在`)
    return
  }
  rootName = projectName
} else if (rootName === projectName) {
  rootName = '.'
} else {
  rootName = projectName
}

init()

function init() {
  download(rootName)
    .then(target => console.log(target))
    .catch(err => console.log(err))
}