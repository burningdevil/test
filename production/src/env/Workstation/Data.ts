import { DataModule, RequestHeaders } from '@mstr/workstation-types'

declare var workstation: any

class Data implements DataModule {
  rcFetch(url: RequestInfo, options?: RequestInit): Promise<Response> {
    throw new Error('Method not implemented.')
  }
  fetch = (url: any, options?: any) => workstation.data.fetch(url, options)

  addDefaultRequestHeader =
    (header: RequestHeaders, value: string) => workstation.data.addDefaultRequestHeader(header, value)

  removeDefaultRequestHeader =
    (header: RequestHeaders) => workstation.data.removeDefaultRequestHeader(header)
}

const data = new Data()
export default data
