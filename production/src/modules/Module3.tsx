import * as React from 'react'
import { Button } from '@mstr/web-components'
import '@mstr/web-components/es/Button/style.scss'
import './Module3.scss'
import { desc } from '../utils/desc'

export default class Module3 extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Button primary={true} text={desc(11540, "Click here")}></Button>
        <div className="module3-welcome">hello module 3!</div>
      </div>
    )
  }
}
