const fs = require('fs')
const promisify = require('util').promisify
const path = require('path')
const handlebars = require('handlebars')
const config = require('../config/defaultConfig')
const mime = require('./mime')
const compress = require('./compress')
const cache = require('./cache')

const filePath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(filePath)
const template = handlebars.compile(source.toString())


module.exports = async function (req, res, filePath) {
  try {
    const stats = await promisify(fs.stat)(filePath)
    
    
    if (stats.isFile()) {
      res.setHeader('Content-Type', mime(filePath))
      if(cache(req, res, stats)){ // true ===
        res.statusCode = 304
        res.end()
        return
      }
      res.statusCode = 200
      let rs = fs.createReadStream(filePath)
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {
      const files = await promisify(fs.readdir)(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const dir = path.relative(config.root, filePath)
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',
        files
      }
      res.end(template(data))
    }
  } catch (error) {
    console.log(error)
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`not a directory or file`)
  }
}