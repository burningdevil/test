import * as React from 'react'
import { HashRouter,BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreenConfigMainView from './modules/components/views/HomeScreenConfigMainView';
import HomeScreenConfigEditor from './modules/components/views/HomeScreenConfigEditor';
import HomeScreenTuriotialView from './modules/components/views/HomeScreenTuriotialView';
import AppearanceEditor from './AppearanceEditor';
export default class App extends React.Component<any, any> {
  // Pages Setup
  routes = (
    <>
    <Routes>
      <Route
        path="/homescreenTuriotial"
        element={<HomeScreenTuriotialView/>}
      />
      <Route
        path="/homescreenConfigMain"
        element={<HomeScreenConfigMainView/>}
      />
      <Route
        path="/homescreenConfigEditor"
        element={<HomeScreenConfigEditor/>}
      />
      <Route
        path="/homescreenConfigEditor?id="
        element={<HomeScreenConfigEditor/>}
      />
      <Route
        path='/appearanceEditor'
        element={<AppearanceEditor/>}
      />
    </Routes>

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
