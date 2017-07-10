import { resolve } from 'path'

export enum Globals {
  ViewsPath = resolve(__dirname, '../views') as any,
  TemplatesPath = resolve(Globals.ViewsPath, 'templates') as any,
}
