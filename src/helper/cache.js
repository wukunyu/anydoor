const { cache } = require('../config/defaultConfig')

function refreshRes(res, stats) {
  const { maxAge, cacheControl, lastModify, etag, expires } = cache
  if (expires) {
    res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString())
  }
  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  }
  if (lastModify) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString())
  }
  if (etag) {
    res.setHeader('ETag', `${stats.size}-${stats.mtime.toUTCString()}`)
  }
}

module.exports = (req, res, stats) => {
  refreshRes(res, stats)
  const lastModify = req.headers['if-modified-since']
  const etag = req.headers['if-none-match']

  if (!lastModify && !etag) {
    return false
  }
  if (lastModify && lastModify !== res.getHeader('Last-Modified')) {
    return false
  }
  if (etag && etag !== res.getHeader('ETag')) {
    return false
  }
  return true
}