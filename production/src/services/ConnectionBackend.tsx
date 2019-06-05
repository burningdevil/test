import * as Promise from 'bluebird'
import 'whatwg-fetch'

const getHeader = (res: any, header: any) => res.headers.get(header.toLowerCase())

declare var mstrConfig: any;

function checkTaskStatus(response: any) {
  const status = response.status

  if (status >= 200 && status < 300) {
    return response
      .text()
      .then((response: any) => new Promise((resolve) => resolve(eval(`(${response})`))))
  } else {
    const error: any = new Error(response.message)
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
function isSessionExpiredError(res: any) {

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
  fetch(url: string, request: any) {
    return fetch(url, request)
  }
  task(taskId: string, params: any, headers: any) {
    let form = new FormData()
    form.append('taskId', taskId)
    if (!params.taskContentType) {
      form.append('taskContentType', 'json')
    }
    if (!params.taskEnv) {
      form.append('taskEnv', 'xhr')
    }
    Object.keys(params).forEach(key => {
      if (key !== 'taskId') {
        if ((key === params.fileFieldName) && params.fileName) {
          form.append(key, params[key], params.fileName)
        } else {
          form.append(key, params[key])
        }
      }
    })

    return this.fetch(mstrConfig.taskURL, {
      credentials: 'same-origin', // To include cookie for ISession
      method: 'POST',
      headers: headers,
      body: form,
      signal: params.signal
    }).then(checkTaskStatus, checkTaskStatus)
  }
}

export const connectionBackend = new ConnectionBackend()
