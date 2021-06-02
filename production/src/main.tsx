import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createStore from './store/createStore'
import RestProxy from './httpProxy/RestProxy'
import App from './App'
import './styles/main.scss'
import WorkStationProxy from './httpProxy/WorkStationProxy'
import browser from './env/Browser'
import workstation from './env/Workstation'
import wsEvents from './env/WSEvents'

declare var __IS_WS__: any
declare var __DEV__: any
declare var __TEST__: any
declare var window: any
declare var module: any

export const HttpProxy = (() => (__IS_WS__ ? WorkStationProxy : RestProxy))()
export const env = __IS_WS__ ? workstation : browser
wsEvents.init(env)
// Store Initialization
// ------------------------------------
export const store = createStore(window.__INITIAL_STATE__)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')
let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    MOUNT_NODE
  )
}
// Development Tools
// ------------------------------------
if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = (error: any) => {
      const RedBox = require('redbox-react').default
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }
    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e)
        renderError(e)
      }
    }
    // Setup hot module replacement
    module.hot.accept(() =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// Let's Go!
// ------------------------------------
if (!__TEST__) {
  if (__IS_WS__ && typeof window.workstation === 'undefined') {
    window.addEventListener('WorkstationLoad', (e: any) => render())
  } else {
    render()
  }
}
