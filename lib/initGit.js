
const execa = require("execa")
exports.initGit = async function (CURRENT_PATH) {
  const result = await execa('git', ['init'], {
    cwd: CURRENT_PATH
  })
  console.log('result',result)
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return

}
