/**
 * Redis database index
 */
export enum RedisTable {
  PageCache = '0',
  WebsitePages = '1',
  SystemSettings = '2',
  SystemLanguage = '3',
  BlogPosts = '4',
  DefaultPage = '5'
}

export enum RedisKeys {
  SystemSettings = 'system_settings'
}
