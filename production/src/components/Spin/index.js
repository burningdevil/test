import React from 'react'
import { Spin as SpinAntD } from 'antd'

import './styles.scss'
import desc from '../../utils/desc';

export default class Spin extends React.Component {
  render() {
    let { text = desc(16305,'Loading...'), ...rest } = this.props
    let indicator = <div className='indicator'>
      {text}
    </div>
    return (
      <SpinAntD delay={0} className='mstr-react-spin' wrapperClassName='mstr-react-spin-wrapper' {...rest} indicator={indicator}>
        {this.props.children}
      </SpinAntD>
    )
  }
}
