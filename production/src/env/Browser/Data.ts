import { DataModule, RequestHeaders } from '@mstr/workstation-types'

const myBlob = new Blob()
const init = { "status" : 200 , "statusText" : "success" }
const res = new Response(myBlob,init)

class Data implements DataModule {
  fetch = async (url: RequestInfo, options?: RequestInit) => res

  addDefaultRequestHeader =
  async (header: RequestHeaders, value: string) => true

  removeDefaultRequestHeader =
  async (header: RequestHeaders) => true
}

const data = new Data()
export default data
