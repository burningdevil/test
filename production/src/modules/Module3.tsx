import * as React from 'react'
import { Button } from '@mstr/web-components'
import '@mstr/web-components/dist/web-styles.css'
import './Module3.scss'
// import { environments } from 'workstation'

declare var workstation: any
export default class Module3 extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { currentEnv: null, envChangeList: [] }
  }
  
  componentWillMount() {
    workstation.environments.getCurrentEnvironment().then((env:any) => {
      this.setState({currentEnv: env})
    })
    workstation.environments.onEnvironmentChange((change: any) => {
      console.dir(change)
      var updateList = this.state.envChangeList
      updateList.push(change)
      this.setState({envChangeList: updateList})
    })
  }
  
  renderEnvDetail(env: any) {
    return (
      env ?
      <ul>
        {
          Object.keys(env).map((key: string) => {
            return (<li>{key}: {env[key]}</li>)
          })
        }
      </ul> : null
    )
  }

  render() {
    return (
      <div>
        <div className="module3-welcome">{ this.state.currentEnv ? <h1>Current Environment</h1> : <h1>No Current Environment, try context menu on one selected object.</h1> }</div>
        <div>
          {this.renderEnvDetail(this.state.currentEnv)}
        </div>
        <div>
          {
            this.state.envChangeList ? this.state.envChangeList.map((envChange: any) => {
              return (<div>
                <h2>Environment Change Type: {envChange.ChangeType}</h2>
                {Object.keys(envChange.WorkstationEnvironments).map((key: any) => {
                  return this.renderEnvDetail(envChange.WorkstationEnvironments[key].EnvironmentDTO)
                })}
              </div>)
            }) : <div>No env change list!</div>
          }
        </div>
      </div>
    )
  }
}
