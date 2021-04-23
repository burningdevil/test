import * as React from 'react'
import '../scss/HomeScreenHomeSetting.scss'
import { Radio, Button } from 'antd';
import { env } from '../../../main'
import { RadioChangeEvent } from 'antd/lib/radio';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { WorkstationModule, ObjectSelectorSettings } from '@mstr/workstation-types';

declare var workstation: WorkstationModule;

const homeScreenType = {
    library: 0,
    dossier: 1,
  };

export default class HomeScreenHomeSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
        dossierName: ''
    };
  }

  loadData = async () => {
    const curEnv = await env.environments.getCurrentEnvironment()
    this.setState({
        currentEnv: curEnv.name
    })
    const { homeScreen } = this.props;
    const dossierUrl = _.get(homeScreen, 'homeDocument.url', '');
    if (dossierUrl) {
        const ids = _.split(dossierUrl, '/');
        const projectId = ids[ids.length - 2];
        const dossierId = ids[ids.length - 1];
        const response = await HttpProxy.get('/objects/' + dossierId + '?type=55', {'X-MSTR-ProjectID': projectId});
        if (response.status == 200) {
            let data = response.data;
            this.setState({
                dossierName: data.name
            })
        } else {
            this.setState({
                dossierName: 'Invalid Dossier'
            })
        }
    }
  }

  componentWillMount() {
    this.loadData();
  }

  openDossierPicker = () => {
    console.log("Env: " + this.state.environmentURL);
    const options: ObjectSelectorSettings = {
      types: ['Dossier', 'Document'],
      footerMessage: 'test',
      excludedIds: []
    }
    workstation.dialogs.objectSelector(options).catch(e =>
      workstation.dialogs.error({
          message: 'Open object editor failed with error',
          additionalInformation: JSON.stringify(e)
      })
    )
  }

  handleHomeSettingChange = (event: RadioChangeEvent) => {
    console.log(event);
    this.props.handleChange( {homeScreen:{mode: event.target.value}} );
  }

  renderPickDossier = () => {
    const { homeScreen } = this.props;
    const dossierUrl = _.get(homeScreen, 'homeDocument.url', '');
    const dossierImg = require('../images/dossier.png');
    if (dossierUrl) {
        return (
            <div className = "home-screen-home-settings-dossier-info">
                <img className = "home-screen-home-settings-dossier-image" src={dossierImg}/>
                <div className = "home-screen-home-settings-dossier-name">
                    {this.state.dossierName}
                </div>
                <Button className = "home-screen-home-settings-dossier-change" disabled = {homeScreen.mode == homeScreenType.library} onClick={this.openDossierPicker}>
                    Change
                </Button>
            </div>
        );
    } else {
        return (
            <Button className = "home-screen-home-settings-pick" disabled = {homeScreen.mode == homeScreenType.library} onClick={this.openDossierPicker}>
                Pick Dossier
            </Button>
        );
    }
  }

  render() {
    const { homeScreen } = this.props;
    return (
        <div className = "home-screen-home-settings">
            <div className="home-screen-home-settings-title">
                Select the Home Screen
            </div>
            <div className="home-screen-home-settings-option">
                <Radio.Group value={ homeScreen.mode } onChange={this.handleHomeSettingChange}>
                    <Radio className="home-screen-home-settings-library" value={homeScreenType.library}>
                            Use the default Library home screen
                    </Radio>
                    <Radio className="home-screen-home-settings-dossier" value={homeScreenType.dossier}>
                        Use a dossier or document in the current server as the home screen
                    </Radio>
                </Radio.Group>
            </div>
            <div className="home-screen-home-settings-hint">
                The default page of the dossier or document be set as the home screen. <br/> This will grant all users in this configuration the View permission for the selected dossier.
            </div>
            {this.renderPickDossier()}
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
