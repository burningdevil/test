import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

import { Menu as MenuAntD } from 'antd'
import SubMenu from './SubMenu'
import Item from './Item'
import Divider from './Divider'

import './style.scss'

export default class Menu extends React.Component {

  onOpenChangeWrapper = (...args) => {
    const { onSubMenuChange } = this.props
    onSubMenuChange && onSubMenuChange(args)
    this.subMenuPopupVerticalAlign()
  }

  subMenuPopupVerticalAlign = () => {
    const $subMenu = $('.ant-menu-submenu.ant-menu-submenu-popup:not(.ant-menu-submenu-hidden)')
    if ($subMenu.length && ($subMenu.offset().top + $subMenu.height() > window.innerHeight)) {
      $subMenu.css({ top: window.innerHeight - $subMenu.height() })
    }
  }

  render() {
    return (<div className='mstr-menu-wrapper'>
      <MenuAntD
        className='mstr-as-menu'
        selectable={false}
        onOpenChange={this.onOpenChangeWrapper}
        {...this.props} >
        {this.props.children}
      </MenuAntD>
    </div>)
  }
}

Menu.Item = Item
Menu.SubMenu = SubMenu
Menu.Divider = Divider

Menu.propTypes = {
  onSubMenuChange: PropTypes.func,
}
