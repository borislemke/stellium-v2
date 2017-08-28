import { resolve } from 'path'

const rootPath = resolve(__dirname, '..')
const viewsPath = resolve(rootPath, 'views')
const seederPath = resolve(rootPath, 'seeder')
const templatesPath = resolve(viewsPath, 'templates')
const dev = process.env.NODE_ENV !== 'production'
const Env = require('../env.json')

export const Globals = {
  Env,
  Development: dev,
  Production: !dev,
  RootPath: rootPath,
  ViewsPath: viewsPath,
  TemplatesPath: templatesPath,
  SeederPath: seederPath,
  SkipCache: typeof process.env.SKIP_CACHE !== 'undefined'
    ? !dev
    : typeof process.env.SKIP_CACHE
}
