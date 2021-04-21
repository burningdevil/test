import * as React from 'react'
import './HomeScreenGeneral.scss'
import { Input, Checkbox } from '@mstr/rc';
import { env } from '../../../main'

export default class HomeScreenGeneral extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
        noteShown: true,
        name: '',
        color: 0,
        opacity: 100,
        emailEnabled: false
    }
  }

  loadData = async () => {
    const curEnv = await env.environments.getCurrentEnvironment()
    this.setState({
        currentEnv: curEnv.name
    })
  }

  componentWillMount() {
    this.loadData();
    // environments.getCurrentEnvironment().then((env: Environment) => {
    //     this.setState({currentEnv: env})
    // });
  }


  render() {
    return (
        <div className = "home-screen-general">
            <div className="home-screen-general-environment">
                <div className="home-screen-general-environment-title">
                    Environment
                </div>
                <div className="home-screen-general-environment-name">
                    {this.state.currentEnv}
                </div>
            </div>
            <div className="home-screen-general-name">
                <div className="home-screen-general-name-title">
                        Name
                    </div>
                    <div className="home-screen-general-name-name">
                        <Input placeholder="Enter Text..." />
                    </div>
            </div>
            <div className="home-screen-general-description">
                <div className="home-screen-general-description-title">
                    Description
                </div>
                <div className="home-screen-general-description-name">
                    <Input placeholder="Enter Text..." />
                </div>
            </div>
            <div className="home-screen-general-platform">
                <div className="home-screen-general-platform-title">
                    Platform
                </div>
                <div className="home-screen-general-platform-name">
                    <Checkbox
                        className=""
                        disabled={false}
                        label="Mobile"
                        onChange={function noRefCheck(){}}
                    />
                    <Checkbox
                        className=""
                        disabled={false}
                        label="Web"
                        onChange={function noRefCheck(){}}
                    />
                    <Checkbox
                        className=""
                        disabled={false}
                        label="Desktop"
                        onChange={function noRefCheck(){}}
                    />
                </div>
            </div>
         </div>
    );
  }
}
// import * as React from 'react'
// import './Module3.scss'
// import { Environment, environments, EnvironmentChangeArg } from "@mstr/workstation-types"

// export default class Module3 extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props)
//     this.state = { currentEnv: null, envChangeList: [] }
//   }
  
//   componentWillMount() {
//     environments.getCurrentEnvironment().then((env: Environment) => {
//       this.setState({currentEnv: env})
//     })
//     // console.dir(environments)
//     // environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
//     //   var updateList = this.state.envChangeList
//     //   updateList.push(change)
//     //   this.setState({envChangeList: updateList})
//     // })
//   }
  
//   renderEnvDetail(env: Environment) {
//     return (
//       env ?
//       <ul>
//         <li>name: {env.name}</li>
//         <li>url: {env.url}</li>
//         <li>webVersion: {env.webVersion}</li>
//         <li>status: {env.status}</li>
//       </ul> : null
//     )
//   }

//   render() {
//     return (
//       <div>
//         <div className="module3-welcome">{ this.state.currentEnv ? <h1>Current Environment</h1> : <h1>No Current Environment, try context menu on one selected object.</h1> }</div>
//         <div>
//           {this.renderEnvDetail(this.state.currentEnv)}
//         </div>
//         <div>
//           {
//             this.state.envChangeList ? this.state.envChangeList.map((envChange: EnvironmentChangeArg) => {
//               return (<div>
//                 <h2>Environment Change Type: {envChange.actionTaken}</h2>
//                 {this.renderEnvDetail(envChange.changedEnvironment)})}
//               </div>)
//             }) : <div>No env change list!</div>
//           }
//         </div>
//       </div>
//     )
//   }
// }
