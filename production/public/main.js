const isString = (s) => typeof s === 'string' || s instanceof String

/**
 * Compare versions
 * @param string v1
 * @param string v2
 * @return:
 *        -1, if v1 < v2
 *         0, if v1 = v2
 *         1, if v1 > v2
 *        -2, if v1 or v2 is invalid
 */
const compareVersion = (v1, v2) => {
  if (!isString(v1) || !isString(v2)) {
    return -2
  }

  const s1 = v1.split('.')
  const s2 = v2.split('.')

  for (let i = 0; i < Math.max(s1.length, s2.length); i++) {
    const n1 = i < s1.length ? parseInt(s1[i]) : 0
    const n2 = i < s2.length ? parseInt(s2[i]) : 0
    if (isNaN(n1) || isNaN(n2)) {
      return -2
    }

    if (n1 < n2) {
      return -1
    }

    if (n1 > n2) {
      return 1
    }
  }

  return 0
}

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
    console.log("openConfigEditor: " + info);
    return {
      url: `/index.html#/homescreenConfigEditor?id=${info.objId}`
    }
  },
  isHomeScreenConfigEnabled: function(info) {
    return getResponseValue(true)
  },
}
