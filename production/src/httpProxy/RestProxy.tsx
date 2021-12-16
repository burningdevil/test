import axiosStatic, { CancelToken } from 'axios'
// import serverConfig from '../../build/server.config'
import base64 from '../utils/base64'
import { RestApiError } from '../server/RestApiError'
import { PARSE_METHOD } from '../utils/ParseMethods'
import axios from '../server/axios'
const serverConfig = require('../../build/server.config')

const parseJsonFunc = PARSE_METHOD.JSON
const baseUrl = '/api'
let authToken: string = null
let isLogin = false

function createHeaders() {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-MSTR-AuthToken': '',
    'X-MSTR-ProjectID': serverConfig.projectId
  }

  if (authToken) {
    headers['X-MSTR-AuthToken'] = authToken
  }

  return headers
}

export function getHeader(res: any, header: any) {
  return res.headers[header.toLowerCase()]
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

    // Get error reponse object
    const errResponse = response.response

    // Is it a Web Task error code?
    const taskErrorCode = getHeader(errResponse, 'X-MSTR-TaskErrorCode')
    if (taskErrorCode < 0) {
      const error = new RestApiError(status, null, base64.decodeHttpHeader(getHeader(errResponse, 'X-MSTR-TaskFailureMsg')), taskErrorCode, statusText)

      // Always log error to console
      window.console.error('fetchUtils::checkStatus(): ', error)

      throw error
    }

    // Create error object and throw
    const errorCode = errResponse.code || ''
    const iServerErrorCode = errResponse.iServerCode || ''
    const errorMsg = errResponse.message || ''
    const ticketId = errResponse.ticketId
    const error = new RestApiError(status, errorCode, errorMsg, iServerErrorCode, statusText, ticketId)

    // Always log error to console
    window.console.error('fetchUtils::checkStatus(): ', error)

    throw error
  }
}

let baseRequest = (method: string, path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) => {
  console.log('check point 1 ===========RestProxy', 'path', path)
  return axios({
    method: method,
    baseURL: baseUrl,
    url: path,
    headers: {
      ...createHeaders(),
      ...headers
    },
    data: JSON.stringify(body),
    cancelToken: signal
  })
  .then(checkResponseStatus, checkResponseStatus)
  .then((res: any) => {
    return res[parseFunc] ? res[parseFunc]() : res
  })
  .catch(((err: any) => console.error(err)))
}

let login = () => {
  console.log('check point 1.1 LOGIN start =============----------TOKEN====================================')
  return baseRequest('post', '/auth/login', {
      username: serverConfig.username,
      password: serverConfig.password
    }, {}, null) // no parse json
    .then((res: any) => {
      authToken = res.headers['x-mstr-authtoken']
      isLogin = false
      console.log('check point 1.2 LOGIN sucessed =============----------TOKEN====================================', authToken)
    })
}

function timeout(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function request (method: string, path: string, body: any, headers: any, parseFunc: any, signal?: CancelToken){
  // in login state and no authToken back yet, wait 1000 ms
  while (isLogin && !authToken) {
    await timeout(1000)
  }
  // if (!authToken) {
  //   isLogin = true
  //   return login()
  //     .then(() => baseRequest(method, path, body, headers, parseFunc, signal))
  // }

  return baseRequest(method, path, body, headers, parseFunc, signal)
}

export default {

  get: function (path: string, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) {
    return request.call(this, 'get', path, null, headers, parseFunc, signal)
  },

  post: function (path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) {
    return request.call(this, 'post', path, body, headers, parseFunc, signal)
  },

  delete: function (path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) {
    return request.call(this, 'delete', path, body, headers, parseFunc, signal)
  },

  put: function put(path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) {
    return request.call(this, 'put', path, body, headers, parseFunc, signal)
  },

  patch: function patch(path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) {
    return request.call(this, 'patch', path, body, headers, parseFunc, signal)
  },

  project: function (method: string, path: string, body: any, headers = {}, parseFunc = parseJsonFunc, signal?: CancelToken) {
    return request.call(this, method, path, body, headers, parseFunc, signal)
  },

  getCancelController: function () {
    const { token: signal, cancel } = axiosStatic.CancelToken.source()
    return { signal, cancel, isCancel: axiosStatic.isCancel }
  }
}
