/**
 * Redis database index
 */
export enum RedisTable {
  PageCache = 'page-cache',
  WebsitePages = 'website-pages',
  SystemSettings = 'system-settings',
  AuthUser = 'auth-users',
  SystemLanguages = 'system-languages',
  BlogPosts = 'blog-posts',
  DefaultPage = 'default-page',
  ClientRegistry = 'client-registry',
  StelliumDomains = 'stellium-domains',
  StaticResources = 'static-resources',
  MediaFiles = 'media-files'
}

export enum StaticResourceKeys {
  AccountNotFound = 'account_not_found'
}

export enum RedisKeys {
  SystemSettings = 'system_settings'
}
