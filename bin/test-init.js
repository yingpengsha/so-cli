#!/usr/bin/env node

const latestVersion = require('latest-version')
const program = require('commander')
const inquirer = require('inquirer')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const download = require('../lib/download')
const generator = require('../lib/generator')

program.usage('<project-name>')
.option('-r, --repository [repository]', 'assign to repository')
.parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {
  // project-name为空，显示--help
  program.help() 
  return
}

const list = glob.sync('*')  // 遍历当前目录

let rootName = path.basename(process.cwd())
let next

if (list.length) {
  // 判断当前目录里面是否有输入的 projectName 目录
  if (list.some(name => {
      const fileName = path.resolve(process.cwd(), path.join('.', name))
      const isDir = fs.statSync(projectName).isDirectory()
      return name.indexOf(projectName) !== -1 && isDir
    })) {
    console.log(`项目 ${projectName} 已经存在`)
    return
  }
  next = Promise.resolve(projectName)

} else if (rootName === projectName) {
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
      type: 'confirm',
      default: true
    }
  ]).then(answer => {
    return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
  })
} else {
  next = Promise.resolve(projectName)
}

function init() {
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot)
    }
    return download(projectRoot).then(target => {
      return {
        name: projectRoot,
        root: projectRoot,
        downloadTemp: target
      }
    })
  }).then(context => {
    return inquirer.prompt([
      {
        name: 'projectName',
    	  message: '项目的名称',
        default: context.name
      }, {
        name: 'projectVersion',
        message: '项目的版本号',
        default: '1.0.0'
      }, {
        name: 'projectDescription',
        message: '项目的简介',
        default: `A project named ${context.name}`
      }
    ]).then(answers => {
      return {
        ...context,
        metadata: {
          ...answers
        }
      }
    })
  }).then(context => {
    return generator(context.metadata, context.downloadTemp, path.parse(context.downloadTemp).dir)
  }).then(context => {
    console.log(context)
  }).catch(err => {
    console.error(err)
  })
}

next && init()