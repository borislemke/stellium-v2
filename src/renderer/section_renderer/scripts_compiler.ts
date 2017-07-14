import { readFile } from 'fs'

const cachedScripts = {}

export const scriptsCompiler = (sectionData: any) => (cb: (err: any, compiledScript: any) => void): void => {

  if (cachedScripts[sectionData.templateName]) {
    return void cb(null, cachedScripts[sectionData.templateName])
  }

  const scriptFilePath = sectionData.template + '/section.js'

  readFile(scriptFilePath, 'utf8', (err, script) => {

    if (err) {
      if (err.code === 'ENOENT') {
        return void cb(null, '')
      }
      return void cb(err, '')
    }

    // TODO(revisit)
    script = script.replace(':host', `data-section-content-${sectionData.sectionId}`)

    cachedScripts[sectionData.templateName] = script

    cb(null, script)
  })
}
