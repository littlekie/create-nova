import fs from 'node:fs'
import path from 'node:path'
import inquirer from 'inquirer'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const readdir = promisify(fs.readdir)
// 直接克隆当前文仓库templates的内容
async function init () {
  // 获取项目模板列表
  const templatesDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `templates`
  )
  const templates = await readdir(templatesDir)
  const defaultTargetDir = 'nova-demo'
  // 让用户选择一个项目模板
const  answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: defaultTargetDir
    },
    {
      type: 'list',
      name: 'template',
      message: 'Choose a template:',
      choices: templates
    },
    // {
    //   type: 'confirm',
    //   name: 'isInitGit',
    //   message: 'Whether to initialize the Git repository',
    //   default: false
    // }
  ])
  const templateDir = path.join(templatesDir, answers.template)

  // 复制模板文件到新建项目的目录中
  const projectName = answers.projectName
  const destDir = path.join(process.cwd(), answers.projectName)
  fs.mkdirSync(destDir)
  fs.readdirSync(templateDir).forEach(file => {
    const srcPath = path.join(templateDir, file)
    const destPath = path.join(destDir, file)
    fs.copyFileSync(srcPath, destPath)
  })
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  console.log(`Project '${projectName}' created successfully.`)
  console.log(`  cd ${projectName}`)
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}

init()


function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}