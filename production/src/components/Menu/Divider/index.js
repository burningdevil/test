import React from 'react'
import { Menu } from 'antd'
import './style.scss'

export default class Divider extends React.Component {
  render() {
    return <Menu.Divider className='mstr-as-menu-divider' {...this.props} >
      {this.props.children}
    </Menu.Divider>
  }
}
