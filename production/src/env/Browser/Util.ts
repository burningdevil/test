import { UtilsModule } from '@mstr/workstation-types'
import { helpUrl } from './constants'

class Utils implements UtilsModule {
  getHelpBaseUrl = async (requestedLang: string) => helpUrl
}

const utils = new Utils()
export default utils
