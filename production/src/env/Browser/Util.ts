import { PluginManifest, UtilsModule } from '@mstr/workstation-types'
import { helpUrl } from './constants'

class Utils implements UtilsModule {
  getLocalizedDescriptor(key: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getPluginInfo(): Promise<PluginManifest> {
    throw new Error('Method not implemented.')
  }
  getHelpBaseUrl = async (requestedLang: string) => helpUrl
}

const utils = new Utils()
export default utils
