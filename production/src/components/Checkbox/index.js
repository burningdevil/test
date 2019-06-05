import React from 'react'
import classnames from 'classnames'
import { Checkbox as CheckboxAntD } from 'antd'

import './styles.scss'

export default class CheckBox extends React.Component {
  render() {
    let { onChange, className, ...otherProps } = this.props
    return (
      <CheckboxAntD className={classnames('mstr-react-checkbox', className)} onChange={e => onChange(e.target.checked)} {...otherProps}>
        {this.props.children}
      </CheckboxAntD>
    )
  }
}
