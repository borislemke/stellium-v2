import { writeFile } from 'fs'
import { resolve } from 'path'
import { Globals } from '../globals'
import * as colors from 'colors'

const doWrite = false

export const WriteStub = (data: any, filename: string): void => {

  if (!doWrite) {
    return
  }

  writeFile(resolve(Globals.RootPath, 'seeder', filename + '.json'), JSON.stringify(data, null, 4), 'utf8', err => {
    if (err) {
      console.log(colors.red('Failed writing stub file for ' + filename))
    }
  })
}
