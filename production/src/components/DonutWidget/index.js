import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './styles.scss'

function DonutWidget({ value, text, textColor, circleColor, className: cssclass }){
  let [ isAnimation, setIsAnimation ] = useState(true)

  useEffect(() => {
    setIsAnimation(true)
  }, [value])

  const circleR = 35
  const strokeWidth = 10
  const cx = 40
  const cy = 40
  let length = 2 * Math.PI * circleR

  let isNegetive = value < 0

  let data = Math.abs(value) * length
  let data2 = length - data
  let dashArr = data + ' ' + data2

  return (
    <div className={classnames('donutSvg', { cssclass })}>
      <svg width='80' height='80' className={'donut'}>
        <circle className='donut-hole' cx={cx} cy={cy} r={circleR - strokeWidth / 2} fill='#fff' />
        <circle className='donut-ring' cx={cx} cy={cy} r={circleR} fill='transparent' stroke='#F0EEEE'
                strokeWidth={strokeWidth} />
        <circle onAnimationEnd={() => setIsAnimation(false)}
                className={classnames('donut-segment', { "circle-animation": isAnimation }, { isNegetive })} cx={cx} cy={cy} r={circleR} fill='transparent'
                stroke={circleColor} strokeWidth={strokeWidth} strokeDasharray={dashArr} strokeDashoffset={length} />
        <text x='50%' y='50%' textAnchor='middle' alignmentBaseline='middle' tclass='chart-number' fill={textColor}>
          {text}
        </text>
      </svg>
    </div>
  )
}

DonutWidget.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  textColor:PropTypes.string,
  circleColor:PropTypes.string
}
DonutWidget.DefaultProps = {
  textColor:'#35383A',
  circleColor:'#3892ED'
}

export default DonutWidget
