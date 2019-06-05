import { connectionBackend } from '../services/ConnectionBackend'
import base64 from '../utils/base64'
import RestApiError from '../server/RestApiError'
import { PARSE_METHOD } from '../utils/ParseMethods'

const parseJsonFunc = PARSE_METHOD.JSON
const baseUrl = '/api'
let authToken = null
let isLogin = false

function createHeaders(projectId) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  if (authToken) {
    headers['X-MSTR-AuthToken'] = authToken
  }

  return headers
}

export function getHeader(res, header) {
  return res.headers.get(header.toLowerCase())
}

function checkResponseStatus(response) {

  // Get status code
  const status = response.status
  const statusText = response.statusText

  // Status code 2XX are OK
  if (status >= 200 && status < 300) {
    return response
  } else {
    // handle network is down
    if (!status && response.message === 'Failed to fetch') {
      const error = new RestApiError(status, '', response.message)

      // Always log error to console
      window.console.error('fetchUtils::checkStatus(): ', error)

      throw error
    }

    // Is it a Web Task error code?
    const taskErrorCode = getHeader(response, 'X-MSTR-TaskErrorCode')
    if (taskErrorCode < 0) {
      const error = new RestApiError(status, '', base64.decodeHttpHeader(getHeader(response, 'X-MSTR-TaskFailureMsg')), taskErrorCode, statusText)

      // Always log error to console
      window.console.error('fetchUtils::checkStatus(): ', error)

      throw error
    }

    return response.json().catch(() => {
      // DE99259, in some cases the response text could not be parsed as JSON.
      return {}
    }).then(json => {
      // Create error object and throw
      const errorCode = json.code || ''
      const iServerErrorCode = json.iServerCode || ''
      const errorMsg = json.message || ''
      const ticketId = json.ticketId
      const error = new RestApiError(status, errorCode, errorMsg, iServerErrorCode, statusText, ticketId)

      // Always log error to console
      window.console.error('fetchUtils::checkStatus(): ', error)

      throw error
    })
  }
}

let baseRequest = (method, path, body, headers = {}, parseFunc = parseJsonFunc) => {
  let params = {
    credentials: 'include',
    cache: 'no-cache',
    method: method.toUpperCase(),
    headers: {
      ...createHeaders(),
      ...headers
    },
    mode: 'cors'
  }
  if (body) {
    params.body = JSON.stringify(body)
  }
  console.log('check point 1 ===========RestProxy', 'path', path)
  return connectionBackend
    .fetch(baseUrl + path, params)
    .then(checkResponseStatus, checkResponseStatus)
    .then(res => {
      return res[parseFunc] ? res[parseFunc]() : res
    })
}

let login = () => {
  console.log('check point 1.1 LOGIN start =============----------TOKEN====================================')
  return baseRequest('post', '/auth/login', {}, {}, null) // no parse json
    .then(res => {
      authToken = res.headers.get('x-mstr-authtoken')
      isLogin = false
      console.log('check point 1.2 LOGIN sucessed =============----------TOKEN====================================', authToken)
    })
}

function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function request (method, path, body, headers, parseFunc){
  // in login state and no authToken back yet, wait 1000 ms
  while (isLogin && !authToken) {
    await timeout(1000)
  }
  if (!authToken) {
    isLogin = true
    return login()
      .then(() => baseRequest(method, path, body, headers, parseFunc))
  }

  return baseRequest(method, path, body, headers, parseFunc)
}

export default {

  get: function (path, parseFunc = parseJsonFunc) {
    return request.call(this, 'get', path, null, {}, parseFunc)
  },

  post: function (path, body, parseFunc = parseJsonFunc) {
    return request.call(this, 'post', path, body, {}, parseFunc)
  },

  del: function (path, body, parseFunc = parseJsonFunc) {
    return request.call(this, 'del', path, body, {}, parseFunc)
  },

  put: function put(path, body, parseFunc = parseJsonFunc) {
    return request.call(this, 'put', path, body, {}, parseFunc)
  },

  patch: function patch(path, body, parseFunc = parseJsonFunc) {
    return request.call(this, 'patch', path, body, {}, parseFunc)
  },

  project: function (method, path, body, headers = {}, parseFunc = parseJsonFunc) {
    return request.call(this, method, path, body, headers, parseFunc)
  }

}
