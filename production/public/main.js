const util = require('./util')

module.exports = {
  openModule1: function(info) {
    return {
      url: `/index.html#/m1?id=${info.objId}`
    }
  },
  openModule2: function(info) {
    return {
      url: `/index.html#/m2?id=${info.objId}`
    }
  },
  openModule3: function(info) {
    return {
      url: `/index.html#/m3?id=${info.objId}`
    }
  },
  isVisibleModule3Menu: function(info) {
    return info && info.environment && util.compareVersion(info.environment.serverVersion, '11.2.0.34535') >= 0
  }
}
