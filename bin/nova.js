#!/usr/bin/env node
//第一行其中#!/usr/bin/env node表示用node解析器执行本文件。
const program = require('commander')
const pkg = require('../package')
const chalk = require('chalk')
const { handleCreate } = require('../lib/creator')

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

program.parse(process.argv)
