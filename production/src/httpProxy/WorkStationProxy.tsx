import { RestApiError } from '../server/RestApiError'
import { PARSE_METHOD } from '../utils/ParseMethods'
import { getErrorMessage } from './errors'

declare var workstation: any

const parseJsonFunc = PARSE_METHOD.JSON

function parseHeaders(response: Response) {
  return response.headers
}

function parseBody(response: Response, responseType: PARSE_METHOD = PARSE_METHOD.JSON) {
  return response[responseType]()
    .then(data => {
      return data
    })
    .catch((err: any) => {
      console.error(err)
    })
}


function parseResponse(response: Response, responseType: PARSE_METHOD = PARSE_METHOD.JSON) {
  if (response.status == 204) {
    return parseHeaders(response)
  } else {
    return parseBody(response, responseType)
  }
}

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

function requestToNative(path: string, body: any = null, headers: any = {}, method = 'GET', parseFunc = parseJsonFunc, signal?: AbortSignal) {
  let options = { method, body, headers, signal }
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
    .then((res: any) => parseResponse(res))
}

function requestToNativeForOtherConnectedEnv(url: string, path: string, body: any = null, headers: any = {}, method = 'GET', parseFunc = parseJsonFunc, signal?: AbortSignal) {
  let options = { method, body, headers, signal }
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
  return workstation.data.fetch(`${url}api${path}`, options)
    .then(checkResponseStatus, checkResponseStatus)
    .then((res: any) => parseResponse(res))
}

export default {
  post: (path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNative(path, body, headers, 'POST', parseFunc, signal)
  },

  get: (path: string, headers = {}, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNative(path, null, headers, 'GET', parseFunc, signal)
  },

  delete: (path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNative(path, body, headers, 'DELETE', parseFunc, signal)
  },

  put: (path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNative(path, body, headers, 'PUT', parseFunc, signal)
  },

  patch: (path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNative(path, body, headers, 'PATCH', parseFunc, signal)
  },

  project: (method: string, path: string, body: any, headers: any, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNative.call(this, { path, body, method, headers, parseFunc, signal })
  },

  getCancelController: function () {
    const controller = new AbortController()
    return {
      signal: controller.signal,
      cancel: () => controller.abort(),
      isCancel: () => controller.signal.aborted
    }
  },

  // used to make a GET request to another connected environment
  getForConnectedEnv: (url: string, path: string, headers = {}, parseFunc = parseJsonFunc, signal?: AbortSignal) => {
    return requestToNativeForOtherConnectedEnv(url, path, null, headers, 'GET', parseFunc, signal)
  }
}
