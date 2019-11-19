'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilArity = require('util-arity');

var _utilArity2 = _interopRequireDefault(_utilArity);

var _isGenerator = require('is-generator');

var _isGenerator2 = _interopRequireDefault(_isGenerator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _parameter_type_registry_builder = require('./parameter_type_registry_builder');

var _parameter_type_registry_builder2 = _interopRequireDefault(_parameter_type_registry_builder);

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function build(_ref) {
  var cwd = _ref.cwd,
      fns = _ref.fns;

  var options = {
    afterHookDefinitions: [],
    beforeHookDefinitions: [],
    defaultTimeout: 5000,
    listeners: [],
    stepDefinitions: [],
    parameterTypeRegistry: _parameter_type_registry_builder2.default.build(),
    World: function World(_ref2) {
      var attach = _ref2.attach,
          parameters = _ref2.parameters;

      this.attach = attach;
      this.parameters = parameters;
    }
  };
  var definitionFunctionWrapper = null;
  var fnArgument = {
    addTransform: helpers.addTransform(options.parameterTypeRegistry),
    defineParameterType: helpers.defineParameterType(options.parameterTypeRegistry),
    After: helpers.defineHook(cwd, options.afterHookDefinitions),
    Before: helpers.defineHook(cwd, options.beforeHookDefinitions),
    defineStep: helpers.defineStep(cwd, options.stepDefinitions),
    registerHandler: helpers.registerHandler(cwd, options.listeners),
    registerListener: function registerListener(listener) {
      options.listeners.push(listener);
    },
    setDefaultTimeout: function setDefaultTimeout(milliseconds) {
      options.defaultTimeout = milliseconds;
    },
    setDefinitionFunctionWrapper: function setDefinitionFunctionWrapper(fn) {
      definitionFunctionWrapper = fn;
    },
    setWorldConstructor: function setWorldConstructor(fn) {
      options.World = fn;
    }
  };
  fnArgument.Given = fnArgument.When = fnArgument.Then = fnArgument.defineStep;
  fns.forEach(function (fn) {
    return fn(fnArgument);
  });
  wrapDefinitions({
    cwd: cwd,
    definitionFunctionWrapper: definitionFunctionWrapper,
    definitions: _lodash2.default.chain(['afterHook', 'beforeHook', 'step']).map(function (key) {
      return options[key + 'Definitions'];
    }).flatten().value()
  });
  options.afterHookDefinitions.reverse();
  return options;
}

function wrapDefinitions(_ref3) {
  var cwd = _ref3.cwd,
      definitionFunctionWrapper = _ref3.definitionFunctionWrapper,
      definitions = _ref3.definitions;

  if (definitionFunctionWrapper) {
    definitions.forEach(function (definition) {
      var codeLength = definition.code.length;
      var wrappedFn = definitionFunctionWrapper(definition.code, definition.options.wrapperOptions, definition.pattern);
      if (wrappedFn !== definition.code) {
        definition.code = (0, _utilArity2.default)(codeLength, wrappedFn);
      }
    });
  } else {
    var generatorDefinitions = _lodash2.default.filter(definitions, function (definition) {
      return _isGenerator2.default.fn(definition.code);
    });
    if (generatorDefinitions.length > 0) {
      var references = generatorDefinitions.map(function (definition) {
        return _path2.default.relative(cwd, definition.uri) + ':' + definition.line;
      }).join('\n  ');
      var message = '\n        The following hook/step definitions use generator functions:\n\n          ' + references + '\n\n        Use \'this.setDefinitionFunctionWrapper(fn)\' to wrap then in a function that returns a promise.\n        ';
      throw new Error(message);
    }
  }
}

exports.default = { build: build };