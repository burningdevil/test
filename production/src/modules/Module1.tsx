import * as React from 'react'
import { EnvironmentChangeArg } from '@mstr/workstation-types'
import './Module1.scss'
import environment, { EVENTS } from '../env/WSEnvironment'

export default class Module1 extends React.Component<any, any> {
  componentDidMount() {
    environment.subscribe({
      [EVENTS.ON_DISCONNECTED]:
      (info) => this.onEnvChange(info, EVENTS.ON_DISCONNECTED)
    })
    environment.subscribe({
      [EVENTS.ON_CONNECTED]:
      (info) => this.onEnvChange(info, EVENTS.ON_CONNECTED)
    })
  }

  onEnvChange = (info: EnvironmentChangeArg, event: string) => {
    console.log(event, info)
  }

  render() {
    return (
      <div>
        <div className='module1-welcome'>Hello World!</div>
      </div>
    )
  }
}
