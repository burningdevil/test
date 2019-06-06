import { RestApiError } from '../server/RestApiError'
import { PARSE_METHOD } from '../utils/ParseMethods'
import { getErrorMessage } from './errors'

declare var workstation: any

const parseJsonFunc = PARSE_METHOD.JSON

function checkResponseStatus(response: any) {
  // Get status code
  const status = response.status
  const statusText = response.statusText

  // Status code 2XX are OK
  if (status >= 200 && status < 300) {
    return response
  } else {
    // handle network is down
    if (!status && response.message === 'Failed to fetch') {
      const error = new RestApiError(status, null, response.message)

      // Always log error to console
      window.console.error('fetchUtils::checkStatus(): ', error)

      throw error
    }

    return response.json().catch(() => {
      // DE99259, in some cases the response text could not be parsed as JSON.
      return {}
    }).then((json: any) => {
      // Create error object and throw
      const errorCode = json.code || ''
      const iServerErrorCode = json.iServerCode || ''
      const errorMsg = json.message || ''
      const ticketId = json.ticketId
      const error = new RestApiError(status, errorCode, getErrorMessage(errorCode, errorMsg), iServerErrorCode, statusText, ticketId)

      // Always log error to console
      window.console.error('fetchUtils::checkStatus(): ', error)

      throw error
    })
  }
}

function requestToNative(path: string, body: any = null, headers: any, method = 'GET', parseFunc = parseJsonFunc) {
  let options = { method, body, headers }
  if (body) {
    options = {
      ...options,
      body: JSON.stringify(body)
    }
  }
  if (headers) {
    options = {
      ...options,
      headers: headers
    }
  }
  return workstation.data.fetch(`api${path}`, options)
    .then(checkResponseStatus, checkResponseStatus)
    .then((res: any) => res[parseFunc] ? res[parseFunc]() : res)
}

export default {
  post: function post(path: string, body: any, parseFunc = parseJsonFunc) {
    return requestToNative(path, body, 'POST', parseFunc)
  },

  get: function get(path: string, parseFunc = parseJsonFunc) {
    return requestToNative(path, 'GET', parseFunc)
  },

  del: function del(path: string, body: any, parseFunc = parseJsonFunc) {
    return requestToNative(path, body, 'DELETE', parseFunc)
  },

  put: function put(path: string, body: any, parseFunc = parseJsonFunc) {
    return requestToNative(path, body, 'PUT', parseFunc)
  },

  patch: function patch(path: string, body: any, parseFunc = parseJsonFunc) {
    return requestToNative(path, body, 'PATCH', parseFunc)
  },

  project: function (method: string, path: string, body: any, headers: any, parseFunc = parseJsonFunc) {
    return requestToNative.call(this, { path, body, method, headers, parseFunc })
  }
}
