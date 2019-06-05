import { HttpProxy } from '../main'
import { connectionBackend } from './ConnectionBackend'

export function post(path, body, parseFunc) {
  return HttpProxy.post(path, body, parseFunc)
}

export function get() {
  return HttpProxy.get.apply(HttpProxy, arguments)
}

export function del(path, body) {
  return HttpProxy.del.apply(HttpProxy, arguments)
}

export function put(path, body) {
  return HttpProxy.put.apply(HttpProxy, arguments)
}

export function patch(path, body) {
  return HttpProxy.patch.apply(HttpProxy, arguments)
}

export function project(method, path, body, headers, parseFunc) {
  return HttpProxy.project.apply(HttpProxy, arguments)
}

export function task(taskId, params) {
  return connectionBackend.task(taskId, params)
}
