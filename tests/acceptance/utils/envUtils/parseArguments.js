var _ = require('lodash');

function parseArguments() {
  let defaultArg = require('../../protractorArgs.json');
  let customArg = {};
  console.log('Parsing Arguments .... ');

  // skip the first 4 arguments: node, protractor, conf.js, --disableChecks
  let cliArgv = process.argv.slice(4);

  for(let i=0; i< cliArgv.length; i++) {
    let arg = cliArgv[i];
    if (arg.startsWith('--')) {
        // remove '--'
        arg = arg.slice(2);
        let nextArg = cliArgv[++i];
        let value = nextArg === 'true' ? true: (nextArg === 'false' ? false : nextArg);
        _.set(customArg, arg, value);
    }
  }

  // overwrite default arguments
  return _.merge(defaultArg, customArg);
}

module.exports = parseArguments;
