declare const Component: {
  'class': string
  data: any
}

interface Translatable {
  [lang: string]: string
}

declare const PageObject: {
  title: Translatable
  url: Translatable
  meta: Translatable

  header_script: string
  footer_script: string

  user: {
    first_name: string
    last_name: string
    social_accounts: {
      twitter: string
    }
  }
}

declare const getSettingsByKey: (key: string) => string

declare const RequestKeys: any

declare const ComponentRenderer: (componentName: string, componentData: any) => void

declare const BaseDomain: string

declare const CurrentURL: string

declare const CompiledStyles: string

declare const TemplateContent: string

declare const SectionScripts: string

declare const CurrentLanguage: string

interface DbCollection {
  Settings: any[]
  Posts: any[]
  Languages: any[]
  Pages: any[]
  Media: any[]
}
