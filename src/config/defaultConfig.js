module.exports = {
  root: process.cwd(),
  hostName: '127.0.0.1',
  port: 9527,
  compress: /\.(html|js|css|md)/,
  cache: {
    maxAge: 500,
    expires: true,
    cacheControl: true,
    lastModify: true,
    etag: true
  }

}