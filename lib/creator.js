const download = require('download-git-repo')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')
const spinner = ora('Loading undead unicorns')
const log = console.log
const { cloneUrlData } = require('./cloneRepositoryUrl')
console.log(cloneUrlData)

exports.handleCreate = (projectName, options) => {
  inquirer
    //用户交互
    .prompt([
      // {
      //   type: 'input',
      //   name: 'author',
      //   message: 'author name?'
      // },
      {
        type: 'list',
        name: 'template',
        message: 'choose a template',
        choices: Object.keys(cloneUrlData)
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
      spinner.succeed('Clone Successfully')
      log(
        `🎉 Successfully created project ${chalk.yellow(projectName)}`
      )
      log(
        `👉 Get started with the following commands: ${chalk.yellow(
          targetPath
        )}`
      )
    }
  )
}