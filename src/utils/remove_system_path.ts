import { Globals } from '../globals'

export const RemoveSystemPath = (text: string): string => {

  const regx = new RegExp(`${Globals.RootPath}/`, 'g')

  return text.replace(regx, '')
}
