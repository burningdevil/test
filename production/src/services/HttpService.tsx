import { HttpProxy } from '../main'
import { connectionBackend } from './ConnectionBackend'

export function post(path:string, body:string, parseFunc: any) {
  return HttpProxy.post(path, body, parseFunc)
}

export function get() {
  return HttpProxy.get.apply(HttpProxy, arguments)
}

export function del(path:string, body:string) {
  return HttpProxy.delete.apply(HttpProxy, arguments)
}

export function put(path:string, body:string) {
  return HttpProxy.put.apply(HttpProxy, arguments)
}

export function patch(path:string, body:string) {
  return HttpProxy.patch.apply(HttpProxy, arguments)
}

export function project(method:string, path:string, body:string, headers: any, parseFunc: any) {
  return HttpProxy.project.apply(HttpProxy, arguments)
}

export function task(taskId:string, params: any) {
  return connectionBackend.task(taskId, params, null)
}
