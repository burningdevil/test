import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Dropdown } from 'antd'
import align from 'dom-align'
import $ from 'jquery'

import './style.scss'

export default class ContextMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cxmVisible: false,
      mouseX:0,
      mouseY:0,
      cxmX:0,
      cxmY:0
    }
    this.onContextMenu = this.onContextMenu.bind(this)
    this.handleCXMVisibleChange = this.handleCXMVisibleChange.bind(this)
  }

  onContextMenu(e) {
    if (!this.props.canActivate || this.props.canActivate(e)) {
      this.setState({
        cxmVisible: true,
        mouseX: e.clientX,
        mouseY: e.clientY,
      })
    }
  }

  handleCXMVisibleChange = (flag) => {
    this.setState({
      cxmVisible: flag
    })
  }

  render() {
    let that = this
    let { children, menu } = this.props
    let { mouseX, mouseY, cxmVisible } = this.state
    let allowedTrigger = []
    let hideAction = ['click']

    return (
      <div style={{ height: '100%' }} onContextMenu={this.onContextMenu} >
        <Dropdown ref={(ref) => { that.dropdown = ref }} overlay={<div onClick={() => { this.handleCXMVisibleChange(false) }}>{menu}</div>}
          overlayClassName='mstr-as-cxm'
          trigger={allowedTrigger} // disbale 'click' triggering, use the below onContextMenu to set visibility of the menu instead
          onVisibleChange={this.handleCXMVisibleChange}
          visible={cxmVisible}
          minOverlayWidthMatchTrigger={false} // auto width
          hideAction={hideAction}
          onPopupAlign={(menu, alignArgus) => {
            let root = $(ReactDOM.findDOMNode(this))
            let menuWidth = $(menu).width()
            let menuHeight = $(menu).height()
            // when onPopupAlign callback be called, we will recalculate our context menu Y-offset
            align(menu, root[0], {
              ...alignArgus,
              points: ['tl', 'bl'],
              offset: [mouseX - root.offset().left, mouseY - root.offset().top - root.height()],
            })
            const overFlowX = menuWidth + mouseX > window.innerWidth
            const overFlowY = menuHeight + mouseY > window.innerHeight
            // If it overflows the visible window, recalculate it by relative positioning it to upper left corner of window
            if (overFlowX || overFlowY) {
              // locate to where the user clicks
              let cxmY = overFlowY ? mouseY - menuHeight : mouseY
              let cxmX = overFlowX ? mouseX - menuWidth : mouseX
              align(menu, window, {
                points: ['tl', 'tl'], // top left
                overflow: {
                  adjustX: 0,
                  adjustY: 0
                },
                offset: [cxmX, cxmY],
                targetOffset: [0, 0]
              })
            }
          }}
        >
          {children}
        </Dropdown>
      </div>
    )
  }
}

ContextMenu.propTypes = {
  menu: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
  canActivate: PropTypes.func
}
