import * as React from 'react'
import classnames from 'classnames'
import Draggable from 'react-draggable'

import './styles.scss'

interface resizerState {
  axis: string,
  style: {},
  bounds: {}
}

export default class Resizer extends React.Component<any, resizerState> {
  constructor(props: any) {
    super(props)
    this.state = {
      axis: 'x',
      style: { },
      bounds: null,
    }
  }

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
