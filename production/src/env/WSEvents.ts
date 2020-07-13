import { EnvironmentStatus, EnvironmentChangeArg, Environment, WorkstationModule } from '@mstr/workstation-types'

export const EVENTS = {
  ON_DISCONNECTED: 'onDisconnected',
  ON_CONNECTED: 'onConnected',
  ON_CONNECTING: 'onConnecting',
  ON_MAINTENANCE: 'onMaintenance',
  ON_OTHER: 'onOther'
}

export type EnvironmentObserver = {
  [key: string]: (info: EnvironmentChangeArg) => void
}

class WSEvents {
  observers: EnvironmentObserver[] = []

  currentEnv: Environment = null

  init = (client: WorkstationModule) => this.registerListeners(client)

  registerListeners = async (client: WorkstationModule) => {
    this.currentEnv = await client.environments.getCurrentEnvironment()
    client.environments.onEnvironmentChange(this.envChangeCallBack)
  }

  subscribe = (observer: EnvironmentObserver) => {
    this.observers.push(observer)
  }

  isSameEnv = (env1: Environment, env2: Environment) => env1 && env2 && env1.id === env2.id

  envChangeCallBack = (info: EnvironmentChangeArg) => {
    if (info && this.isSameEnv(info.changedEnvironment, this.currentEnv)) {
      switch (info.changedEnvironment.status) {
      case EnvironmentStatus.Disconnected:
        this.notify(EVENTS.ON_DISCONNECTED, info)
        break;
      case EnvironmentStatus.Connected:
        this.notify(EVENTS.ON_CONNECTED, info)
        break;
      case EnvironmentStatus.Connecting:
        this.notify(EVENTS.ON_CONNECTING, info)
        break;
      case EnvironmentStatus.MaintenanceMode:
        this.notify(EVENTS.ON_MAINTENANCE, info)
        break;
      default:
        this.notify(EVENTS.ON_OTHER, info)
      }
    }
  }

  remove = (observer: EnvironmentObserver) => {
    this.observers = this.observers.filter(obsv => obsv !== observer)
  }

  notify = (method: string, info: EnvironmentChangeArg) => {
    this.observers.forEach(observer => {
      observer[method] && observer[method](info)
    })
  }
}

const wsEvents = new WSEvents()
export default wsEvents
