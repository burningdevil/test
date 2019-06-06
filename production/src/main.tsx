import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createStore from './store/createStore'
import RestProxy from './httpProxy/RestProxy'
import BrowserDebug from './env/BrowserDebug'
import App from './App'
import './styles/main.scss'
import WorkStationProxy from './httpProxy/WorkStationProxy'
import Workstation from './env/Workstation'
import insertScript from './utils/insertScript'
import getLang from './utils/getLang'

declare var __IS_WS__: any
declare var __DEV__: any
declare var __TEST__: any
declare var window: any
declare var module: any

export const HttpProxy = (() => {
  return __IS_WS__ ? WorkStationProxy : RestProxy
})()
export const env: any = __IS_WS__ ? Workstation : BrowserDebug
// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)
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
  insertScript(`descriptors/${getLang()}.js`)
    .then(render)
    .catch(render)
}
env.onAppStart && env.onAppStart(store)
// Test TypeScript
type Message = {
  body: string,
  from: string
}
let message: Message = {
  from: 'Max',
  body: 'Hi!'
}
console.log(`New message from ${message.from}: ${message.body}`)
