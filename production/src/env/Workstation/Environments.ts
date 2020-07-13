import { EnvironmentsModule, EnvironmentChangeCallBack } from '@mstr/workstation-types'

declare var workstation: any

class Environments implements EnvironmentsModule {
  getCurrentEnvironment = () => workstation.environments.getCurrentEnvironment()

  getAvailableEnvironments = () => workstation.environments.getAvailableEnvironments()

  onEnvironmentChange = (callback: EnvironmentChangeCallBack) => workstation.environments.onEnvironmentChange(callback)

  offEnvironmentChange = (callback: EnvironmentChangeCallBack) => workstation.environments.offEnvironmentChange(callback)
}

const environments = new Environments()
export default environments
