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
    return info && info.environment && compareVersion(info.environment.serverVersion, '11.2.0.34535') >= 0
  }
}
