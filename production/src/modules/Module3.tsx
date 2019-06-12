import * as React from 'react'
import { Button } from '@mstr/web-components'
import '@mstr/web-components/dist/web-styles.css'
import './Module3.scss'

export default class Module3 extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Button primary={true} text="Click me!"></Button>
        <div className="module3-welcome">hello module 3!</div>
      </div>
    )
  }
}
