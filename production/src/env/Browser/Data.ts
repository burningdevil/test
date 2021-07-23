import { DataModule, RequestHeaders } from '@mstr/workstation-types'
import { apiResp } from './constants'

class Data implements DataModule {
  rcFetch(url: RequestInfo, options?: RequestInit): Promise<Response> {
    throw new Error('Method not implemented.')
  }
  fetch = async (url: any, options?: any) => apiResp

  addDefaultRequestHeader =
  async (header: RequestHeaders, value: string) => true

  removeDefaultRequestHeader =
  async (header: RequestHeaders) => true
}

const data = new Data()
export default data
