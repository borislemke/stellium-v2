import { readFile } from 'fs'

const cachedScripts = {}

export const scriptsCompiler = (moduleData: any) => (cb: (err: any, compiledScript?: any) => void): void => {

  if (cachedScripts[moduleData.templateName]) {
    return void cb(null, cachedScripts[moduleData.templateName])
  }

  const scriptFilePath = moduleData.template + '/module.js'

  readFile(scriptFilePath, 'utf8', (err, script) => {

    if (err) {
      if (err.code === 'ENOENT') {
        console.log('err\n', err)
        return void cb(null)
      }
      return void cb(err)
    }

    // TODO(revisit)
    script = script.replace(':host', `data-content-${moduleData.moduleId}`)

    cachedScripts[moduleData.templateName] = script

    cb(null, script)
  })
}
