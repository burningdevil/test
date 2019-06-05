import Promise from 'bluebird'
import 'whatwg-fetch'

const getHeader = (res, header) => res.headers.get(header.toLowerCase())

function checkTaskStatus(response) {
  const status = response.status

  if (status >= 200 && status < 300) {
    return response
      .text()
      .then(response => new Promise((resolve) => resolve(eval(`(${response})`))))
  } else {
    const error = new Error(response.message)
    error.statusCode = response.status
    error.iServerErrorCode = getHeader(response, 'X-MSTR-TaskErrorCode')
    error.errorMessage = getHeader(response, 'X-MSTR-TaskFailureMsg')
    if (isSessionExpiredError(response)) {
      error.sessionExpired = true
      // mstrApp.onSessionExpired()
      // return Promise.reject()
    }
    throw error
  }
}

/**
 * Check response code to see whether the xhr error because of disconnected session.
 *
 * @private
 * @ignore
 */
function isSessionExpiredError(res) {

  let MSI_SERVER_NAME_NOT_INITIALIZED = 0x800438F3  // Server Name Not initialized
  let MSI_INVALID_SESSION_ID = 0x800438F4         // Session ID invalid
  let E_MSI_USERMGR_USER_NOTFOUND = 0x800430A5      // UserLogin expired
  let E_MSI_CONNECT_FAILED = 0x80043705

  if (res.status === 401) {
    return true
  }
  var c = res && getHeader(res, 'X-MSTR-TaskErrorCode')
  c = (c < 0) ? (0x100000000 + parseInt(c, 10)) : c
  switch (c) {
      case MSI_SERVER_NAME_NOT_INITIALIZED:
      case MSI_INVALID_SESSION_ID:
      case E_MSI_USERMGR_USER_NOTFOUND:
      case E_MSI_CONNECT_FAILED:
        return true
  }
  return false
}

export class ConnectionBackend {
  fetch(url, request) {
    return fetch(url, request)
  }
}

export const connectionBackend = new ConnectionBackend()
