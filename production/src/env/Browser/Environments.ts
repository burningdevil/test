import { EnvironmentsModule, EnvironmentChangeCallBack } from '@mstr/workstation-types'

const env = {
  id: '2D357C22-2AF2-494A-B8AF-7F077BBF8733',
  name: 'Test Env',
  status: 2,
  subType: -1,
  type: -1,
  url: new URL('http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/'),
  webVersion: '11.2.0200.130358J'
}

class Environments implements EnvironmentsModule {
  getCurrentEnvironment = async () => env

  getAvailableEnvironments = async () => [env]

  onEnvironmentChange = (callback: EnvironmentChangeCallBack) => {}

  offEnvironmentChange = (callback: EnvironmentChangeCallBack) => {}
}

const environments = new Environments()
export default environments
