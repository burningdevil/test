import * as React from 'react'
import { Button } from '@mstr/web-components'
import '@mstr/web-components/es/Button/style.scss'
import './Module1.scss'

export default class Module1 extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Button primary={true} text="Click me!"></Button>
        <div className="module1-welcome">hello world!</div>
      </div>
    )
  }
}
