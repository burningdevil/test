import React from 'react'
import { Tooltip as TooltipAntd } from 'antd'
import classnames from 'classnames'

import './styles.scss'

export default class Tooltip extends React.Component {
  render() {
    let { overlayClassName , ...rest } = this.props
    return (
      <TooltipAntd overlayClassName={classnames('mstr-tooltip-overlay',this.props.overlayClassName)} {...rest}>
        {this.props.children}
      </TooltipAntd>
    )
  }
}