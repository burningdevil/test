import * as React from 'react'
import { HashRouter, Route } from 'react-router-dom';
import HomeScreenConfigMainView from './modules/components/views/HomeScreenConfigMainView';
import HomeScreenConfigEditor from './modules/components/views/HomeScreenConfigEditor';
import HomeScreenObjectPicker from './modules/components/views/HomeScreenObjectPicker';
import HomeScreenObjectList from './modules/components/views/HomeScreenObjectList';

export default class App extends React.Component<any, any> {  
  // Pages Setup
  routes = (
    <>
      <Route
        path="/homescreenConfigMain"
        component={HomeScreenConfigMainView}
      />
      <Route
        path="/homescreenConfigEditor"
        component={HomeScreenConfigEditor}
      />
      <Route
        path="/homescreenConfigEditor?id="
        component={HomeScreenConfigEditor}
      />
      <Route
        path="/homeScreenObjectPicker"
        component={HomeScreenObjectPicker}
      />
      <Route
        path="/homeScreenObjectList"
        component={HomeScreenObjectList}
      />
    </>
  )
  render() {
    return (
      <HashRouter>
        {this.routes}
      </HashRouter>
    )
  }
}
