import React from 'react'
import { Radio as RadioAntD } from 'antd'

import './styles.scss'

export default class RadioGroup extends React.Component {
  render() {
    let { value, onChange, ...otherProps } = this.props
    return (
      <RadioAntD.Group className='mstr-react-radio-group' onChange={e => onChange(e.target.value)} value={value} {...otherProps}>
        {this.props.children}
      </RadioAntD.Group>
    )
  }
}
