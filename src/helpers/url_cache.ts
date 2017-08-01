// /post/2017/blah -> 1023786407128297460123

function hashMap (toHash: string): string {
  let hash = 0
  let i
  let chr
  if (toHash.length === 0) return '' + hash
  for (i = 0; i < toHash.length; i++) {
    chr = toHash.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    // Convert to 32bit integer
    hash |= 0
  }
  return '' + hash
}

export const stringToCacheKey = (..._url: string[]): string => {

  /**
   * TODO(opt): Optimise string manipulation
   * @date - 7/10/17
   * @time - 7:24 PM
   */
  return _url.map(_target => hashMap(_target))
    .join('-')
    .replace(/\/+/g, '/')
    .replace(/^-+|-+$/g, '')
}
