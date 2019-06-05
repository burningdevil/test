import React from 'react'

import { Menu } from 'antd'
import './style.scss'

export default class SubMenu extends React.Component {
  render() {
    return (
      <Menu.SubMenu className='mstr-as-sub-menu' {...this.props}
        onTitleClick={ params => {
          this.props.onTitleClick && this.props.onTitleClick(params)
          params.domEvent.stopPropagation()
        }}
      >
        {this.props.children}
      </Menu.SubMenu>
    )
  }
}
