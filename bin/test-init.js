#!/usr/bin/env node

const logSymbols = require('log-symbols')
const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const download = require('../lib/download')
const generator = require('../lib/generator')
const templateList = require('../lib/list')

program
  .usage('<project-name>')
  .parse(process.argv)

let projectName = program.args[0]

if (!projectName) {
  program.help() 
  return
}

const list = glob.sync('*')

let rootName = path.basename(process.cwd())
let next

if (list.length) {
  if (list.some(name => {
    const fileName = path.resolve(process.cwd(), path.join('.', name))  
    const isDir = fs.statSync(fileName).isDirectory()
      return name.indexOf(projectName) !== -1 && isDir
    })) {
    console.log(logSymbols.error, chalk.red(`${projectName} directory is exist`))
    return
  }
  next = Promise.resolve(projectName)

} else if (rootName === projectName) {
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: 'The current directory is empty and the directory name is the same as the project name. Do you want to create a new project directly in the current directory?',
      type: 'confirm',
      default: true
    }
  ]).then(answer => {
    if (!answer.buildInCurrent) { return }
    return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
  })
} else {
  next = Promise.resolve(projectName)
}



function init() {
  next.then(projectRoot => {
    return inquirer.prompt([
      {
        type: 'list',
        message: 'Please select a template:',
        name: 'templateName',
        choices: Object.keys(templateList)
      },
      {
        name: 'projectName',
    	  message: 'Project Name:',
        default: projectName
      }, {
        name: 'projectVersion',
        message: 'Project Version',
        default: '1.0.0'
      }, {
        name: 'projectDescription',
        message: 'Project description',
        default: `A project named ${projectName}`
      }
    ]).then(answers => {
      if (projectRoot !== '.') {
        fs.mkdirSync(projectRoot)
      }
      return download(projectRoot, templateList[answers.templateName]).then(target => {
        return {
          name: projectRoot,
          root: projectRoot,
          downloadTemp: target,
          metadata: {
            ...answers
          }
        }
      })
    })
  }).then(context => {
    return generator(context.metadata, context.downloadTemp, path.parse(context.downloadTemp).dir)
  }).then(context => {
    console.log()
    console.log(logSymbols.success, chalk.green('Created successfully :)'))
    console.log()
  }).catch(err => {
    console.error(logSymbols.error, chalk.red(`Fail：${error.message}`))
  })
}

next && init()