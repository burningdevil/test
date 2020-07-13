import * as React from 'react'
import { EnvironmentChangeArg } from '@mstr/workstation-types'
import './Module1.scss'
import environment, { EVENTS } from '../env/WSEvents'
import { env } from '../main'

export default class Module1 extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    environment.subscribe({
      [EVENTS.ON_DISCONNECTED]:
      (info) => this.onEnvChange(info, EVENTS.ON_DISCONNECTED)
    })
    environment.subscribe({
      [EVENTS.ON_CONNECTED]:
      (info) => this.onEnvChange(info, EVENTS.ON_CONNECTED)
    })
    this.loadData()
  }

  loadData = async () => {
    const selecedObject = await env.selectedObject.getSelectedObject()
    const curEnv = await env.environments.getCurrentEnvironment()
    this.setState({
      object: selecedObject.name,
      curEnv: curEnv.name
    })
  }

  onEnvChange = (info: EnvironmentChangeArg, event: string) => {
    console.log(event, info)
  }

  render() {
    const { object, curEnv } = this.state
    return (
      <div>
        <div className='module1-welcome'>Plugin Module 1</div>
        <div>{`Selected Object - ${object}`}</div>
        <div>{`Current Environmet - ${curEnv}`}</div>
      </div>
    )
  }
}
