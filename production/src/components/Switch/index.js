import React from 'react'
import { Switch as SwitchAntd } from 'antd'

import './styles.scss'

export default class Switch extends React.Component {
  render() {
    let { ...otherProps } = this.props

    return (
      <SwitchAntd className='mstr-react-switch' {...otherProps}>
        {this.props.children}
      </SwitchAntd>
    )
  }
}
