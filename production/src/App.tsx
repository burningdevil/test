import * as React from 'react'
import { HashRouter, Route, Link } from 'react-router-dom';
import Module1 from './modules/Module1'
import Module2 from './modules/Module2'
import Module3 from './modules/Module3'

export default class App extends React.Component<any, any> {  
  // Pages Setup
  routes = (
    <div>
      <Route path="/m1" component={Module1} />
      <Route path="/m2" component={Module2} />
      <Route path="/m3" component={Module3} />
    </div>
  )
  render() {
    return (
      <HashRouter>
        {this.routes}
      </HashRouter>
    )
  }
}
