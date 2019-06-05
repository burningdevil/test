import React from 'react'

import { Menu } from 'antd'
import './style.scss'

export default class Item extends React.Component {
  render() {
    return (
      <Menu.Item className='mstr-as-menu-item' {...this.props} >
        {this.props.children}
      </Menu.Item>
    )
  }
}
