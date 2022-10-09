const download = require('download-git-repo')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')
const spinner = ora('Loading undead unicorns')
const log = console.log
const { cloneUrlData } = require('./cloneRepositoryUrl')
const { initGit } = require('./initGit')
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
        name: 'templateName',
        message: 'choose a template',
        choices: Object.keys(cloneUrlData)
      },
      {
        type: 'confirm',
        name: 'isInitGit',
        message: 'Whether to initialize the Git repository',
        default: false
      },
      // {
      //   type: 'confirm',
      //   name: 'install',
      //   message: 'Yes No Install Dependency',
      //   default: false
      // }
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
  const { projectName, templateName, isInitGit } = options
  const CURRENT_PATH = process.cwd() // 获取当前路径
  const targetPath = path.resolve(CURRENT_PATH, projectName) // 目标路径
  spinner.start(`Cloning template ${chalk.yellow(projectName)}`)
  download(
    `direct:${cloneUrlData[templateName]}`,
    projectName,
    { clone: true },
    async (err )=> {
      if (err) {
        spinner.fail(chalk.green('下载失败 \n' + err))
        process.exit()
      }
      if (isInitGit) {
        await initGit(targetPath)
      }
      spinner.succeed( `Successfully created project ${chalk.yellow(projectName)}`)
      // log(
      //   `🎉 Successfully created project ${chalk.yellow(projectName)}`
      // )
      log(
        `👉  Get started with the following commands:\n\n` +
        chalk.cyan(` ${chalk.gray('$')} cd ${projectName}\n`) +
        chalk.cyan(` ${chalk.gray('$')} yarn install \n`) +
        chalk.cyan(` ${chalk.gray('$')} yarn dev \n`)
        )
      
    }
  )
}