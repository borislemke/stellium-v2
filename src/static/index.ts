// ROOT
export interface RootConfig {
  languages: {
    'default': boolean,
    title: string,
    code: string,
    status: boolean
  }[]
}

export class Servant {

  private _rootModule

  constructor (rootModule) {
    this._rootModule = rootModule
  }

  public static async bootstrap (rootModule: any): Promise<any> {
    const compiler = new Servant(rootModule)

    return compiler.compileRoutes()
  }

  compileRoutes (): Promise<any> {
    const routes = this._rootModule.routes

    return new Promise(resolve => {
      resolve(null)
    })
  }
}

// PAGE
export interface PageConfig {
  modules: Modules
}

function StPage (config: PageConfig) {

  return function (target) {
    return target
  }
}

export abstract class OnRender {

  stOnRender (): boolean {
    return true
  }
}

// COMPONENT
function Component (config?) {

  return function (target) {
    return target
  }
}

function Input (name?: string) {
  return function (target, descriptor) {
    return descriptor
  }
}

@Component()
export class FullScreenComponent {
  // @Input()
  // title: string
}

export interface ModuleData {
  component: Function,
  data: {
    [key: string]: any
  }
}

export type Modules = ModuleData[]

@StPage({
  modules: [
    {
      component: FullScreenComponent,
      data: {
        title: 'Blah'
      }
    }
  ]
})
export class HomePage implements OnRender {

  stOnRender (): boolean {
    console.log('Blah')
    return false
  }
}

// ROUTE
export interface Route {
  path: string,
  'default': boolean,
  component: Function
}

export type Routes = Route[]

// MODULE
export interface ModuleConfig {
  routes: Routes
}

function StModule (config: ModuleConfig) {

  return function (target) {
    const rootRoutesSymbol = Symbol(target.name)
    Object.defineProperty(global, rootRoutesSymbol, {
      get: () => {
        return config.routes
      }
    })
    return target
  }
}

@StModule({
  routes: [
    {
      path: '',
      'default': true,
      component: HomePage
    }
  ]
})
export class RootModule {
}

// BOOTSTRAP
const port = process.env.SERVICE_PORT || '3000'

Servant.bootstrap(RootModule)
  .then(() => console.log('Bootstrapped on port', port))
  .catch(err => console.log('Boot strap failed', err))
