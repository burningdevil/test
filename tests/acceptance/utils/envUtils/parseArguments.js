var _ = require('lodash')

function parseArguments() {
  const defaultArg = require('../../protractorArgs.json')
  const customArg = {}
  console.log('Parsing Arguments .... ')

  // skip the first 4 arguments: node, protractor, conf.js, --disableChecks
  const cliArgv = process.argv.slice(4)

  for (let i = 0; i < cliArgv.length; i++) {
    let arg = cliArgv[i]
    if (arg.startsWith('--')) {
      // remove '--'
      arg = arg.slice(2)
      const nextArg = cliArgv[++i]
      // process true or false
      let value = nextArg === 'true' ? true : (nextArg === 'false' ? false : nextArg)
      // process object
      if (nextArg.startsWith('{')) {
        value = JSON.parse(nextArg)
      }
      _.set(customArg, arg, value)
    }
  }

  // overwrite default arguments
  return _.merge(defaultArg, customArg)
}

module.exports = parseArguments
