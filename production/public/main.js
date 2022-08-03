const getResponseValue = function(booleanResult) {
  return {
    responseValue: booleanResult
  }
}

module.exports = {
  openConfigMain: function(info) {
    return {
      url: `/index.html#/homescreenConfigMain`
    }
  },
  openNewConfig: function(info) {
    return {
      url: `/index.html#/homescreenConfigEditor`
    }
  },
  openEditConfig: function(info) {
    return {
      url: `/index.html#/homescreenConfigEditor?id=${info.objId}`
    }
  },
  isHomeScreenConfigEnabled: function(info) {
    return getResponseValue(true)
  },
  openAppearanceEditor: function(info) {
    return {
      url: '/index.html#/appearanceEditor'
    }
  }
}
