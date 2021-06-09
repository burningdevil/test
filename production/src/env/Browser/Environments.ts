import { EnvironmentsModule, EnvironmentChangeCallBack } from '@mstr/workstation-types'
import { env } from './constants'

class Environments implements EnvironmentsModule {
  disconnect(url: string): void {
    throw new Error('Method not implemented.')
  }
  getCurrentEnvironment = async () => env

  getAvailableEnvironments = async () => [env]

  onEnvironmentChange = (callback: EnvironmentChangeCallBack) => {}

  offEnvironmentChange = (callback: EnvironmentChangeCallBack) => {}
}

const environments = new Environments()
export default environments
