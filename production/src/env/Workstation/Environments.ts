import { EnvironmentsModule, EnvironmentChangeCallBack } from '@mstr/workstation-types'

declare var workstation: any

class Environments implements EnvironmentsModule {
  disconnect(url: string): void {
    throw new Error('Method not implemented.')
  }
  getCurrentEnvironment = () => workstation.environments.getCurrentEnvironment()

  getAvailableEnvironments = () => workstation.environments.getAvailableEnvironments()

  onEnvironmentChange = (callback: EnvironmentChangeCallBack) => workstation.environments.onEnvironmentChange(callback)

  offEnvironmentChange = (callback: EnvironmentChangeCallBack) => workstation.environments.offEnvironmentChange(callback)
}

const environments = new Environments()
export default environments
