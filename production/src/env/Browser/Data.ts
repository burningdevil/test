import { DataModule, RequestHeaders } from '@mstr/workstation-types'
import { apiResp } from './constants'

class Data implements DataModule {
  fetch = async (url: any, options?: any) => apiResp

  addDefaultRequestHeader =
  async (header: RequestHeaders, value: string) => true

  removeDefaultRequestHeader =
  async (header: RequestHeaders) => true
}

const data = new Data()
export default data
