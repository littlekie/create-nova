import fs from 'fs-extra'
import { writeFileSync } from "node:fs";
import colors from 'picocolors'
import type { Options as ExecaOptions, ExecaReturnValue } from 'execa'
import execa from 'execa'
import path from 'node:path'

async function main(): Promise<void> {
  let targetVersion:string 
  step('\nUpdating package version...')

  const tag = await getLatestTag('create-nova')

  targetVersion = tag.split('@')[1]
  const pkgDir = path.resolve(__dirname, '../', 'package.json')
  updateVersion(pkgDir, targetVersion)

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: ${tag}`])
    // await run('git', ['tag', tag])
  } else {
    console.log('No changes to commit.')
    return
  }

  step('\nPushing to GitHub...')
  // await run('git', ['push', 'origin', `refs/tags/${tag}`])
  await run('git', ['push'])

}

export function updateVersion(pkgPath: string, version: string): void {
  const pkg = fs.readJSONSync(pkgPath)
  pkg.version = version
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

export function step(msg: string): void {
  return console.log(colors.cyan(msg))
}

export async function getLatestTag(pkgName: string): Promise<string> {
  const tags = (await run('git', ['tag'], { stdio: 'pipe' })).stdout
    .split(/\n/)
    .filter(Boolean)
  const prefix = pkgName === 'nova' ? 'v' : `${pkgName}@`
  return tags
    .filter((tag) => tag.startsWith(prefix))
    .sort()
    .reverse()[0]
}
export async function publishPackage(
  pkdDir: string,
  tag?: string,
): Promise<void> {
  const publicArgs = ['publish', '--access', 'public']
  if (tag) {
    publicArgs.push(`--tag`, tag)
  }
  await run('npm', publicArgs, {
    cwd: pkdDir,
  })
}
export async function run(
  bin: string,
  args: string[],
  opts: ExecaOptions<string> = {},
): Promise<ExecaReturnValue<string>> {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}

main().then(()=>console.log('Release successfully')).catch(err=>console.log(err))