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
    console.log("openConfigEditor: " + info);
    return {
      url: `/index.html#/homescreenConfigEditor`
    }
  },
  openEditConfig: function(info) {
    console.log("openConfigEditor: " + info.objId);
    return {
      url: `/index.html#/homescreenConfigEditor?id=${info.objId}`
    }
  },
  openObjectPicker: function(info) {
    console.log("openObjectPicker");
    return {
      url: `/index.html#/homescreenObjectPicker`
    }
  },
  openContentBundlePicker: function(info) {
    console.log("openContentBundlePicker");
    return {
      url: `/index.html#/contentBundlePicker`
    }
  },
  isHomeScreenConfigEnabled: function(info) {
    return getResponseValue(true)
  },
}
