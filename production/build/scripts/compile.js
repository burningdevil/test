const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const logger = require('../lib/logger')
const webpackConfig = require('../webpack.config')
const project = require('../../project.config')

const runWebpackCompiler = (webpackConfiguration) => new Promise((resolve, reject) => {
  webpack(webpackConfiguration).run((err, stats) => {
    if (err) {
      logger.error('Webpack compiler encountered a fatal error.', err)
      return reject(err)
    }

    const jsonStats = stats.toJson()
    if (jsonStats.errors.length > 0) {
      logger.error('Webpack compiler encountered errors.')
      logger.log(jsonStats.errors.join('\n'))
      return reject(new Error('Webpack compiler encountered errors'))
    }
    if (jsonStats.warnings.length > 0) {
      logger.warn('Webpack compiler encountered warnings.')
      logger.log(jsonStats.warnings.join('\n'))
    }
    resolve(stats)
  })
})

const generateBuildStats = (stats) => {
  const buildStats = {
    ...stats && { BUILD_DURATION: (stats.endTime - stats.startTime) / 1000 }, // calculate build time in secs
    BUILD_TOOL: 'webpack',
    BUILD_RESULT: stats ? 'PASS' : 'FAIL'
  }
  logger.log('\r\n') // new line
  logger.log(`METRICS_BUILD=${JSON.stringify(buildStats)}`)
}

const compile = () => Promise.resolve()
  .then(() => logger.info('Starting compiler...'))
  .then(() => logger.info(`Target application environment: ${chalk.bold(project.env)}`))
  .then(() => runWebpackCompiler(webpackConfig))
  .then((stats) => {
    logger.info(`Copying static assets from ./public to ./${project.outDir}.`)
    fs.copySync(
      path.resolve(project.basePath, 'public'),
      path.resolve(project.basePath, project.outDir)
    )
    return stats
  })
  .then((stats) => {
    if (project.verbose) {
      logger.log(stats.toString({
        colors: true,
        chunks: false,
      }))
    }
    logger.success(`Compiler finished successfully! See ./${project.outDir}.`)
    generateBuildStats(stats)
  })
  .catch((err) => {
    logger.error('Compiler encountered errors.', err)
    generateBuildStats()
  })

compile()
