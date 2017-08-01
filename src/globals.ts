import { resolve } from 'path'

const rootPath = resolve(__dirname, '..')
const viewsPath = resolve(rootPath, 'views')
const seederPath = resolve(rootPath, 'seeder')
const templatesPath = resolve(viewsPath, 'templates')
const dev = true

export const Globals = {
  Development: dev,
  Production: !dev,
  RootPath: rootPath,
  ViewsPath: viewsPath,
  TemplatesPath: templatesPath,
  SeederPath: seederPath
}
