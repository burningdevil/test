import { EnvironmentsModule, EnvironmentChangeCallBack } from '@mstr/workstation-types'
import { env } from './constants'

class Environments implements EnvironmentsModule {
  getCurrentEnvironment = async () => env

  getAvailableEnvironments = async () => [env]

  onEnvironmentChange = (callback: EnvironmentChangeCallBack) => {}

  offEnvironmentChange = (callback: EnvironmentChangeCallBack) => {}
}

const environments = new Environments()
export default environments
