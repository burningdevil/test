import { UtilsModule } from '@mstr/workstation-types'

declare var workstation: any

class Utils implements UtilsModule {
  getHelpBaseUrl = (requestedLang: string) => workstation.utils.getHelpBaseUrl(requestedLang)
}

const utils = new Utils()
export default utils
