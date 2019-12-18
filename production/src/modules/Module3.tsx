import * as React from 'react'
import './Module3.scss'
import { Environment, environments, EnvironmentChangeArg } from "@mstr/workstation-types"

export default class Module3 extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { currentEnv: null, envChangeList: [] }
  }
  
  componentWillMount() {
    environments.getCurrentEnvironment().then((env:any) => {
      this.setState({currentEnv: env})
    })
    // console.dir(environments)
    // environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
    //   var updateList = this.state.envChangeList
    //   updateList.push(change)
    //   this.setState({envChangeList: updateList})
    // })
  }
  
  renderEnvDetail(env: Environment) {
    return (
      env ?
      <ul>
        <li>name: {env.name}</li>
        <li>url: {env.url}</li>
        <li>webVersion: {env.webVersion}</li>
        <li>status: {env.status}</li>
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
            this.state.envChangeList ? this.state.envChangeList.map((envChange: EnvironmentChangeArg) => {
              return (<div>
                <h2>Environment Change Type: {envChange.actionTaken}</h2>
                {this.renderEnvDetail(envChange.changedEnvironment)})}
              </div>)
            }) : <div>No env change list!</div>
          }
        </div>
      </div>
    )
  }
}
