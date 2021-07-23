import { PluginManifest, UtilsModule } from '@mstr/workstation-types'

declare var workstation: any

class Utils implements UtilsModule {
  getLocalizedDescriptor(key: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getPluginInfo(): Promise<PluginManifest> {
    throw new Error('Method not implemented.')
  }
  getHelpBaseUrl = (requestedLang: string) => workstation.utils.getHelpBaseUrl(requestedLang)
}

const utils = new Utils()
export default utils
