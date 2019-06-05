import React from 'react'
import { Radio as RadioAntD } from 'antd'

import './styles.scss'

export default class Radio extends React.Component {
  render() {
    return (
      <RadioAntD className='mstr-react-radio' {...this.props}>
        {this.props.children}
      </RadioAntD>
    )
  }
}
