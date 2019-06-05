import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import align from 'dom-align'
import $ from 'jquery'

import { Dropdown as PopoverAntd } from 'antd'

import './styles.scss'

const builtinPlacements = {
  left: {
    points: ['cr', 'cl'],
  },
  right: {
    points: ['cl', 'cr'],
  },
  top: {
    points: ['bc', 'tc'],
  },
  bottom: {
    points: ['tc', 'bc'],
  },
  topLeft: {
    points: ['bl', 'tl'],
  },
  topRight: {
    points: ['br', 'tr'],
  },
  bottomRight: {
    points: ['tr', 'br'],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
  },
};


export default class Popover extends Component {

  render() {
    let { overlayClassName, visible, placement, content, onVisibleChange, children, menuWidth, menuHeight, destroyPopupOnHide } = this.props

    return (
      <PopoverAntd
        destroyPopupOnHide={destroyPopupOnHide}
        placement={placement}
        minOverlayWidthMatchTrigger={false} // auto width
        overlayClassName={classnames('mstr-react-popover-overlay', overlayClassName)}
        visible={visible}
        onVisibleChange={v =>
          onVisibleChange(v)
        }
        overlay={<div>{content}</div>}
        trigger='click'

        onPopupAlign={(menu, alignArgus) => {
          if(!menuHeight) return
          let root = $(ReactDOM.findDOMNode(this)),
            triggerDomPosition = root.offset(),
            downAvailable = triggerDomPosition.top + root.height() + menuHeight < window.innerHeight,
            rightAvailable = triggerDomPosition.left + menuWidth < window.innerWidth,
            directionString = ( downAvailable ? 'bottom' : 'top' ) + ( rightAvailable ? 'Left' : 'Right' )

          // when onPopupAlign callback be called, we will recalculate start point
          align(menu, root[0], {
            ...alignArgus,
            points:builtinPlacements[directionString].points,
          })

        }}
      >
        {
          children
        }
      </PopoverAntd>
    )
  }
}

Popover.propTypes = {
  placement: PropTypes.string,
  overlayClassName: PropTypes.string,
  onVisibleChange: PropTypes.func,
  content: PropTypes.element.isRequired,
  destroyPopupOnHide: PropTypes.bool
}

Popover.defaultProps = {
  placement: 'bottomLeft',
  overlayClassName: '',
  destroyPopupOnHide: false,
  onVisibleChange: () => {}
}
