// /post/2017/blah -> ccUSpostccUS2017ccUSblah
export const stringToCacheKey = (_url: string): string => {
  let hash = 0, i, chr
  if (_url.length === 0) return ''+hash
  for (i = 0; i < _url.length; i++) {
    chr = _url.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    // Convert to 32bit integer
    hash |= 0
  }
  return ''+hash
}

// ccUSpostccUS2017ccUSblah -> /post/2017/blah
export const cacheKeyToString = () => {
}
