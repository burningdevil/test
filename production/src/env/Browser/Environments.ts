import { EnvironmentsModule, EnvironmentChangeCallBack, ConnectionSettings, Environment } from '@mstr/workstation-types'
import { env } from './constants'

class Environments implements EnvironmentsModule {
  connect(url: string, options?: ConnectionSettings): Promise<Environment> {
    throw new Error('Method not implemented.')
  }
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
