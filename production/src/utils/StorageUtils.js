import cookie from 'cookie'

function isDesiredStorageSupported(storageOption) {
  try {
    const TEST_KEY = 'test key'
    storageOption.setItem(TEST_KEY, 'some value')
    storageOption.removeItem(TEST_KEY)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check if localStorage is writable in the current browser.
 *
 * @returns {boolean} whether localStorage is writable
 */
function isLocalStorageSupported() {
  return isDesiredStorageSupported(window.localStorage)
}

/**
 * Check if sessionStorage is writable in the current browser.
 *
 * @returns {boolean} whether sessionStorage is writable
 */
function isSessionStorageSupported() {
  return isDesiredStorageSupported(window.sessionStorage)
}

/**
 * Get the cookie value
 * @param {string} name Name of the cookie
 * @returns {string} the value of the cookie
 */
function getCookieValue(name) {
  return cookie.parse(document.cookie)[name]
}

// Create a in-memory storage object that simulates browser locale/session storage apis
function createInMemoryStorage() {
  const storage = {}

  Object.defineProperty(storage, 'setItem', {
    value: function (key, value) {
      storage[key] = String(value)
    }
  })

  Object.defineProperty(storage, 'getItem', {
    value: function (key) {
      return storage.hasOwnProperty(key) ? storage[key] : null;
    }
  })

  Object.defineProperty(storage, 'removeItem', {
    value: function (key) {
      delete storage[key]
    }
  });

  Object.defineProperty(storage, 'clear', {
    value: function () {
      Object.keys(storage).map((key) => {
        storage.removeItem(key)
      })
    }
  })
  return storage
}

const StorageUtils = {
  /**
   * Shared in-memory storage for the app
   */
  inMemoryStorage: createInMemoryStorage(),

  /**
   * A safe localStorage which saves to memory when localStorage is not supported (e.g. in Safari Incognito mode)
   */
  safeLocalStorage: (() => {
    if (isLocalStorageSupported()) {
      return window.localStorage
    } else {
      return {
        _data: {},
        setItem: function (key, value) {
          this._data[key] = String(value)
        },
        getItem: function (key) {
          return this._data.hasOwnProperty(key) ? this._data[key] : null
        },
        removeItem: function (key) {
          delete this._data[key]
        },
        clear: function () {
          this._data = {}
        }
      }
    }
  })(),

  safeSessionStorage: (() => {
    if (isSessionStorageSupported()) {
      return window.sessionStorage
    } else {
      return createInMemoryStorage()
    }
  })(),

  getISessionId() {
    // if there is no iSession in the cookie, return an empty seesion string ''
    return getCookieValue('iSession') || ''
  },

  getCookieValue
}

module.exports = StorageUtils
