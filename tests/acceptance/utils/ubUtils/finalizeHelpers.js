'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.wrapDefinitions = wrapDefinitions

var _lodash = require('lodash')

var _lodash2 = _interopRequireDefault(_lodash)

var _utilArity = require('util-arity')

var _utilArity2 = _interopRequireDefault(_utilArity)

var _isGenerator = require('is-generator')

var _isGenerator2 = _interopRequireDefault(_isGenerator)

var _path = require('path')

var _path2 = _interopRequireDefault(_path)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function wrapDefinitions(_ref) {
  var cwd = _ref.cwd
  var definitionFunctionWrapper = _ref.definitionFunctionWrapper
  var definitions = _ref.definitions

  if (definitionFunctionWrapper) {
    definitions.forEach(function(definition) {
      var codeLength = definition.code.length
      var wrappedFn = definitionFunctionWrapper(
        definition.code,
        definition.options.wrapperOptions,
        definition.pattern
      )
      if (wrappedFn !== definition.code) {
        definition.code = (0, _utilArity2.default)(codeLength, wrappedFn)
      }
    })
  } else {
    var generatorDefinitions = _lodash2.default.filter(definitions, function(
      definition
    ) {
      return _isGenerator2.default.fn(definition.code)
    })
    if (generatorDefinitions.length > 0) {
      var references = generatorDefinitions
        .map(function(definition) {
          return (
            _path2.default.relative(cwd, definition.uri) + ':' + definition.line
          )
        })
        .join('\n  ')
      var message =
        `\n        The following hook/step definitions use generator functions:\n\n          ` +
        references +
        `\n\n        Use 'this.setDefinitionFunctionWrapper(fn)' to wrap then in a function that returns a promise.\n        `
      throw new Error(message)
    }
  }
}
