import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Slider as SliderAntD } from 'antd'

import './styles.scss'

export default class Slider extends Component {
  render() {
    let { onChange, className, ...otherProps } = this.props

    return (
      <SliderAntD className={classnames('mstr-react-slider', className)}
        onChange={v => onChange(v)}
        {...otherProps}
      />
    )
  }
}

Slider.propTypes={
  onChange: PropTypes.func.isRequired
}
