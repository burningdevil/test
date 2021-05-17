import * as React from 'react'
import '../scss/HomeScreenGeneral.scss'
import { Checkbox } from '@mstr/rc';
import { env } from '../../../main'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as _ from "lodash";
import { Input } from 'antd';
import { platformType } from '../HomeScreenConfigConstant';
const { TextArea } = Input;

export default class HomeScreenGeneral extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentEnv: {name: '', url: ''}
    };
  }

  loadData = async () => {
    const curEnv = await env.environments.getCurrentEnvironment()
    this.setState({
        currentEnv: curEnv
    })
  }

  componentWillMount() {
    this.loadData();
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);
      this.props.handleChange({name: event.target.value});
  }

  handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value);
    this.props.handleChange({description: event.target.value});
  }

  handlePlatformMobileChange = (event: CheckboxChangeEvent) => {
    console.log(event);
    this.handlePlatformChange(event, 'Mobile');
  }

  handlePlatformWebChange = (event: CheckboxChangeEvent) => {
    console.log(event);
    this.handlePlatformChange(event, 'Web');
  }

  handlePlatformDesktopChange = (event: CheckboxChangeEvent) => {
    console.log(event);
    this.handlePlatformChange(event, 'Desktop');
  }

  handlePlatformChange = (event: CheckboxChangeEvent, platType: string) => {
    console.log(event);
    const { platform } = this.props;
    let resultedPlatform;
    if (event.target.checked) {
        resultedPlatform = _.concat(platform, platType);
    } else {
        resultedPlatform = _.pull(platform, platType);
    }
    this.props.handleChange({platform: resultedPlatform});
  }

  render() {
    const { name, description, platform } = this.props;
    return (
        <div className = "home-screen-general">
            <div className="home-screen-general-environment">
                <div className="home-screen-general-environment-title">
                    Environment
                </div>
                <div className="home-screen-general-environment-name">
                    {this.state.currentEnv.name}
                </div>
            </div>
            <div className="home-screen-general-name">
                <div className="home-screen-general-name-title">
                        Name
                    </div>
                    <div className="home-screen-general-name-name">
                        <Input placeholder="" value = {name} onChange={this.handleNameChange}/>
                    </div>
            </div>
            <div className="home-screen-general-description">
                <div className="home-screen-general-description-title">
                    Description
                </div>
                <div className="home-screen-general-description-name">
                    <TextArea className="home-screen-general-description-name-input" placeholder="" rows = {3} value = {description} onChange={this.handleDescChange}/>
                </div>
            </div>
            <div className="home-screen-general-platform">
                <div className="home-screen-general-platform-title">
                    Platform
                </div>
                <div className="home-screen-general-platform-name">
                    <Checkbox
                        className="home-screen-general-platform-mobile"
                        disabled={false}
                        label="Mobile"
                        checked={platform.includes(platformType.mobile)}
                        onChange={this.handlePlatformMobileChange}
                    />
                    <Checkbox
                        className=""
                        disabled={false}
                        label="Web"
                        checked={platform.includes(platformType.web)}
                        onChange={this.handlePlatformWebChange}
                    />
                    <Checkbox
                        className=""
                        disabled={false}
                        label="Desktop"
                        checked={platform.includes(platformType.desktop)}
                        onChange={this.handlePlatformDesktopChange}
                    />
                </div>
            </div>
            <div className="home-screen-general-url">
              <div className="home-screen-general-url-title">
                  App Url
              </div>
              <div className="home-screen-general-url-name">
                  {this.state.currentEnv.url + 'config/' + this.props.configId}
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
