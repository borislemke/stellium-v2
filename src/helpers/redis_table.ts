/**
 * Redis database index
 */
export enum RedisTable {
  PageCache = '0',
  WebsitePages = '1',
  SystemSettings = '2',
  SystemLanguage = '3',
  BlogPosts = '4',
  DefaultPage = '5',
  ClientRegistry = '6',
  StaticResources = '7',
  MediaFiles = '8'
}

export enum StaticResourceKeys {
  AccountNotFound = 'account_not_found'
}

export enum RedisKeys {
  SystemSettings = 'system_settings'
}
