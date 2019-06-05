const express = require('express')
const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const compress = require('compression')

const _ = require('lodash')

const logger = require('../build/lib/logger')
const webpackConfig = require('../build/webpack.config')
const project = require('../project.config')
const descriptorCompiler = require('../build/scripts/CompileDescriptors')
const app = express()

let connectionInfo = {
  "server": "http://10.27.20.50:8080",
  "base": "/MicroStrategyConsumer",
  "username": "administrator",
  "password": "",
  "projectID":"7D17F8784C83F8052B81FFBF2626B7CA"
}

let cfgFilePath = path.join('server', '.librc.json')
if (fs.existsSync(cfgFilePath)) {
  let json = fs.readJSONSync(cfgFilePath)
  connectionInfo = _.merge(connectionInfo, json)
}

var proxy = require('http-proxy-middleware')
app.use(proxy(pathname => {
  return pathname.match(/^\/api/) && pathname !== '/api/auth/login'
}, {
  target: connectionInfo.server,
  changeOrigin: true,
  cookiePathRewrite: '/',
  pathRewrite: {
    '^/' : connectionInfo.base + '/'
  },
  onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('X-MSTR-ProjectID', connectionInfo.projectID)
  }
}))

app.use('/api/auth/login', proxy({
  target: connectionInfo.server,
  changeOrigin: true,
  cookiePathRewrite: '/',
  pathRewrite: {
    '^/api/auth/login' : connectionInfo.base + '/api/auth/login'
  },
  onError(err, req, res) {
  },
  onProxyReq(proxyReq, req, res) {
    let body = {}

    body.username = connectionInfo.username
    body.password = connectionInfo.password
    body = JSON.stringify(body)
    // Update header
    proxyReq.setHeader('Content-Type', 'application/json')
    proxyReq.setHeader('Content-Length', body.length)
    proxyReq.setHeader('X-MSTR-ProjectID', connectionInfo.projectID)

    // Write out body changes to the proxyReq stream
    proxyReq.write(body)
    proxyReq.end()
  }
}))

app.use(compress())

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  descriptorCompiler.exportToResourceFile(path.resolve(project.basePath, 'public'))

  logger.info('Enabling webpack development and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : path.resolve(project.basePath, project.srcDir),
    hot         : true,
    quiet       : false,
    noInfo      : false,
    lazy        : false,
    stats       : 'normal',
  }))
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(path.resolve(project.basePath, 'public')))

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use(/^!(\/api)/, function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  logger.warn(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(path.resolve(project.basePath, project.outDir)))
}

module.exports = app
