import { DataModule, RequestHeaders } from '@mstr/workstation-types'

declare var workstation: any

class Data implements DataModule {
  fetch = (url: RequestInfo, options?: RequestInit) => workstation.data.fetch(url, options)

  addDefaultRequestHeader =
    (header: RequestHeaders, value: string) => workstation.data.addDefaultRequestHeader(header, value)

  removeDefaultRequestHeader =
    (header: RequestHeaders) => workstation.data.removeDefaultRequestHeader(header)
}

const data = new Data()
export default data
