import React, { useState } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import { Popover } from 'antd'
import { SketchPicker } from 'react-color'

import './styles.scss'

const PRESET_COLORS = [
  '#EE4F4F', '#FFF200', '#2DBE60', '#00C6DB', '#009BE4', '#7E30F2', '#3B5998',
  '#707476', '#FFFFFF', '#D9232E', '#FFCC00', '#66AA33', '#1798C1', '#1E88E5',
  '#783BD2', '#003A72', '#35383A', '#CED0D1', '#A81612', '#FF9900', '#00704A',
  '#0072C6', '#405DE6', '#400095', '#35415A', '#000000', '#ABB0B3'
]

const DEFAULT_WIDTH = 230

function ColorPicker( { color, onColorChange, className }) {
  let [open, setOpen] = useState(false)

  let content = <SketchPicker
    color={color}
    onChangeComplete={c => onColorChange(c.hex)}
    presetColors={PRESET_COLORS}
    width={DEFAULT_WIDTH}
    disableAlpha
  />
  return (
    <Popover
      overlayClassName='mstr-color-picker-overlay'
      content={content}
      trigger='click'
      visible={open}
      onVisibleChange={visible => setOpen(visible) }
    >
      <div className={classnames('mstr-react-color-picker', className, { open })}>
        <div className='color-icon' />
        <div className='color-preview' style={{ background: color }} />
      </div>
    </Popover>
  )
}

ColorPicker.propTypes = {
  color: PropTypes.string,
  onColorChange: PropTypes.func,
  className: PropTypes.string
}

ColorPicker.defaultProps = {
  className: '',
  color: '#ffffff',
  onColorChange: () => {}
}

export default ColorPicker
