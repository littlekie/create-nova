import { writeFileSync } from "node:fs";
import colors from 'picocolors'
import prompts from 'prompts'
import { getPackageInfo, getVersionChoices, run, step, updateVersion } from './releaseUtil';
import semver from 'semver'

async function main(): Promise<void> {
  let targetVersion:string | undefined
  const {currentVersion, pkgPath} = getPackageInfo()
  if (!targetVersion) {
    // 选择 release version
    const { release }: { release: string } = await prompts({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: getVersionChoices(currentVersion),
    })

    if (release === 'custom') {
      const res: { version: string } = await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
      targetVersion = res.version
    } else {
      targetVersion = release
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const tag = `create-nova@${targetVersion}`

  const { yes }: { yes: boolean } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${colors.yellow(tag)} Confirm?`,
  })

  if (!yes) {
    return
  }

  step('\nUpdating package version...')
  updateVersion(pkgPath, targetVersion)
  
  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: ${tag}`])
    await run('git', ['tag', tag])
  } else {
    console.log('No changes to commit.')
    return
  }

  step('\nPushing to GitHub...')
  await run('git', ['push', 'origin', `refs/tags/${tag}`])
  await run('git', ['push'])

}





main().then(()=>console.log('Release successfully')).catch(err=>console.log(err))