#!/usr/bin/env node
//第一行其中#!/usr/bin/env node表示用node解析器执行本文件。
const program = require('commander')
const pkg = require('../package')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const path = require('path')
const spinner = ora('Loading undead unicorns')
const inquirer = require('inquirer')
const log = console.log
const cloneUrlData = {
  'mimi-element-plus': `https://github.com/littlekie/mimi-element-plus.git`,
  'vue2': `https://github.com/littlekie/learnVue.git`
}
/**
 * version
 */
program.version(chalk.green(`${pkg.version}`))

/**
 * init 项目
 */
program
  .command('create <app-name>')
  .description(
    'generate a project from a remote template (legacy API, requires ./wk-init)'
  )
  .option('-c, --clone', 'Use git clone when fetching remote template')
  .action((appName, options) => {
    handleCreate(appName, options)
    return
  })

const handleCreate = (projectName, options) => {
  inquirer
    //用户交互
    .prompt([
      {
        type: 'input',
        name: 'author',
        message: 'author name?'
      },
      {
        type: 'list',
        name: 'template',
        message: 'choose a template',
        choices: ['mimi-element-plus', 'vue2']
      }
    ])
    .then(answers => {
      //根据回答以及选项，参数来生成项目文件
      creator({ ...answers, projectName, ...options })
    })
    .catch(error => {
      console.error(error)
    })
}

const creator = options => {
  const { projectName, template } = options
  const CURRENT_PATH = process.cwd() // 获取当前路径
  const targetPath = path.resolve(CURRENT_PATH, projectName) // 目标路径
  download(
    `direct:${cloneUrlData[template]}`,
    projectName,
    { clone: true },
    err => {
      if (err) {
        spinner.fail(chalk.green('下载失败 \n' + err))
        process.exit()
      }

      log(
        `🎉 Successfully created project ${chalk.yellow(projectName)}`
      )
      log(
        `👉 Get started with the following commands: ${chalk.yellow(
          targetPath
        )}`
      )
      spinner.succeed()
    }
  )
}

program.parse(process.argv)
