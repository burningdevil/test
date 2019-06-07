import * as React from 'react'
import { Button } from '@mstr/web-components'
import '@mstr/web-components/dist/web-styles.css'
import './app.scss'

export default class App extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Button primary={true} text="Click me!"></Button>
        ><div className="">hello world!</div>
      </div>
    )
  }
}
