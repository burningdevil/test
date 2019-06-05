import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Draggable from 'react-draggable'

import './style.scss'

export default class Resizer extends React.Component {
  render() {
    let { style, onStop, axis, bounds, ...others } = this.props
    return (
      <Draggable
        onStop={onStop}
        axis={axis}
        bounds={bounds}
        {...others}
      >
        <div
          className={classnames('mstr-react-resizer', axis)}
          style={style}
        />
      </Draggable>
    )
  }
}

Resizer.propTypes = {
  axis: PropTypes.oneOf([
    'x',
    'y'
  ]),
  style: PropTypes.object,
  bounds:PropTypes.object,
  onStop: PropTypes.func.isRequired
}

Resizer.defaultProps = {
  axis: 'x',
  style: {},
  bounds: null
}
