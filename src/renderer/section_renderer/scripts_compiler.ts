import { readFile } from 'fs'
import { assignHoistId, HoistType } from '../utils/hoist_id'
import { Globals } from '../../globals'
import { ArgusClient } from '../../utils/argus'

const cachedScripts = {}

export const scriptsCompiler = (sectionData: any) => (cb: (err: any, compiledScript: any) => void): void => {

  if (cachedScripts[sectionData.templateName] && Globals.Production) {
    return void cb(null, cachedScripts[sectionData.templateName])
  }

  const scriptFilePath = sectionData.template + '/section.js'

  readFile(scriptFilePath, 'utf8', (err, script) => {

    if (err) {
      if (err.code === 'ENOENT') {
        return void cb(null, '')
      }
      ArgusClient.send(err)
      return void cb(err, '')
    }

    // TODO(revisit)
    script = script.replace(
      ':host',
      assignHoistId(HoistType.Content, sectionData.sectionId, false)
    )

    cachedScripts[sectionData.templateName] = script

    cb(null, script)
  })
}
