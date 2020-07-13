import { UtilsModule } from '@mstr/workstation-types'

const url = 'http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/'

class Utils implements UtilsModule {
  getHelpBaseUrl = async (requestedLang: string) => url
}

const utils = new Utils()
export default utils
